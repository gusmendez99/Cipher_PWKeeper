/*
*  Some functions from https://github.com/bitwiseshiftleft/sjcl library
*/

const {
	HMAC,
	PBKDF2,
	SHA256,
	compareBitArrays,
	decryptWithGCM,
	encryptwithGCM,
	paddedBitArrayToString,
	randomBitArray,
	setupCipher,
	stringToPaddedBitArray,
	bitArrayToHex,
	hexToBitArray,
} = require("../utils/utils.min");

const {
	KEYCHAIN_STATE_OFF,
	KEYCHAIN_STATE_ON,
	MAX_PASSWORD_LENGTH_BYTES,
} = require("./constants");

const omit = require("lodash/omit");

class KeyChain {
	constructor() {
		this.state = KEYCHAIN_STATE_OFF;
		this.keys = {};
		this.data = {};
	}

	init(password) {
		const version = "v2";
		const salt = randomBitArray(128);
		const masterKey = PBKDF2(password, salt);
		const hmacKey = HMAC(masterKey, "MAC KEY SECRET");
		const aesKey = HMAC(masterKey, "AES KEY SECRET").slice(0, 4);
		const authKey = HMAC(hmacKey, "AUTH KEY SECRET");

		const cipher = setupCipher(aesKey);
		const credentials = {};

		this.keys = { cipher, masterKey, hmacKey, aesKey };
		this.data = { credentials, salt, version, authKey };
		this.state = KEYCHAIN_STATE_ON;
	}

	load(password, representation, trustedDataCheck) {
		if (!(trustedDataCheck == undefined)) {
			const checkSHA = SHA256(representation);
			//console.log(checkSHA, trustedDataCheck)
			if (!compareBitArrays(checkSHA, trustedDataCheck)) {
				throw "Representation and SHA256 hash have different values...";
			}
		}

		const parsedData = JSON.parse(representation);
		//console.log('parsed', parsedData)
		const masterKey = PBKDF2(password, parsedData.salt);
		const hmacKey = HMAC(masterKey, "MAC KEY SECRET");
		const hmacPassword = HMAC(hmacKey, "AUTH KEY SECRET");
		if (!compareBitArrays(hmacPassword, parsedData.authKey)) {
			return false;
		}

		const aesKey = HMAC(masterKey, "AES KEY SECRET").slice(0, 4);
		const cipher = setupCipher(aesKey);

		this.data = parsedData;
		this.keys = { masterKey, hmacKey, aesKey, cipher };
		this.state = KEYCHAIN_STATE_ON;
		return true;
	}

	dump() {
		if (this.state === KEYCHAIN_STATE_OFF) return null;
		const representation = JSON.stringify(this.data);
		return [representation, SHA256(representation)];
	}

	get(name) {
		if (this.state === KEYCHAIN_STATE_OFF)
			throw "Keychain not initialized.";
		const { hmacKey, cipher } = this.keys;
		const hmacDomain = HMAC(hmacKey, name);
		const domainAsString = bitArrayToHex(hmacDomain);

		if (domainAsString in this.data.credentials) {
			const decryptedValue = decryptWithGCM(
				cipher,
				hexToBitArray(this.data.credentials[domainAsString]),
				hmacDomain
			);
			return paddedBitArrayToString(decryptedValue, MAX_PASSWORD_LENGTH_BYTES);
		}
		return null;
	}

	set(name, value) {
		if (this.state === KEYCHAIN_STATE_OFF)
			throw "Keychain not initialized.";
		const { hmacKey, cipher } = this.keys;
		const hmacDomain = HMAC(hmacKey, name);
		const paddedValue = stringToPaddedBitArray(
			value,
			MAX_PASSWORD_LENGTH_BYTES
		);
		const encryptedValue = bitArrayToHex(
			encryptwithGCM(cipher, paddedValue, hmacDomain)
		);
		this.data.credentials[bitArrayToHex(hmacDomain)] = encryptedValue;
	}

	remove(name) {
		if (this.state === KEYCHAIN_STATE_OFF)
			throw "Keychain not initialized.";
		const hmacDomain = bitArrayToHex(HMAC(this.keys.hmacKey, name));
		if (hmacDomain in this.data.credentials) {
			this.data.credentials = omit(this.data.credentials, [hmacDomain]);
			return true;
		}
		return false;
	}
}

module.exports.KeyChain = KeyChain;
