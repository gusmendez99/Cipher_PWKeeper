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
} = require("./utils");

const {
	KEYCHAIN_STATE_OFF,
	KEYCHAIN_STATE_ON,
	MAX_PASSWORD_LENGTH_BYTES,
} = require("./constants");

const omit = require("lodash/omit");

class KeyChain {
	constructor() {
		this.state = KEYCHAIN_STATE_OFF
		this.keys = {}
		this.data = {}
	}
	
	init (password) {
		this.data.version = "v2";
		this.data.salt = randomBitArray(128);
		this.keys.masterKey = PBKDF2(
			password,
			this.data.salt
		);
		this.keys.hmacKey = HMAC(
			this.keys.masterKey,
			"MAC KEY STRING"
		);
		this.keys.aesKey = HMAC(
			this.keys.masterKey,
			"AES KEY SECRET"
		).slice(0, 4);
		this.data.authKey = HMAC(
			this.keys.hmacKey,
			"AUTH KEY SECRET"
		);
		this.keys.cipher = setupCipher(this.keys.aesKey);
		this.data.credentials = {};

		this.state = KEYCHAIN_STATE_ON;
	};

	load (password, representation, trustedDataCheck) {
		console.log('Here i am')
		if (!(trustedDataCheck == undefined)) {
			var checkSHA = SHA256(representation);
			console.log(checkSHA, trustedDataCheck)
			if (!compareBitArrays(checkSHA, trustedDataCheck)) {
				throw "Representation and SHA256 hash have different values...";
			}
		}

		var parsedData = JSON.parse(representation);
		console.log('parsed', parsedData)
		var masterKey = PBKDF2(password, parsedData.salt);
		var hmacKey = HMAC(masterKey, "MAC KEY STRING");
		var hmacPassword = HMAC(hmacKey, "AUTH KEY SECRET");
		if (!compareBitArrays(hmacPassword, parsedData.authKey)) {
			return false;
		}

		this.data = parsedData;
		this.keys.masterKey = masterKey;
		this.keys.hmacKey = hmacKey;
		this.keys.aesKey = HMAC(masterKey, "AES KEY SECRET").slice(
			0,
			4
		);
		this.keys.cipher = setupCipher(this.keys.aesKey);

		this.state = KEYCHAIN_STATE_ON;
		return true;
	};

	dump () {
		if (this.state === KEYCHAIN_STATE_OFF) return null;
		var representation = JSON.stringify(this.data);
		return [representation, SHA256(representation)];
	};

	get (name) {
		if (this.state === KEYCHAIN_STATE_OFF) throw "Keychain not initialized.";
		var hmacDomain = HMAC(this.keys.hmacKey, name);
		var domainAsString = bitArrayToHex(hmacDomain);
		if (domainAsString in this.data.credentials) {
			var values = decryptWithGCM(
				this.keys.cipher,
				hexToBitArray(this.data.credentials[domainAsString]),
				hmacDomain
			);
			return paddedBitArrayToString(values, MAX_PASSWORD_LENGTH_BYTES);
		}
		return null;
	};

	set (name, value) {
		if (this.state === KEYCHAIN_STATE_OFF) throw "Keychain not initialized.";
		var hmacDomain = HMAC(this.keys.hmacKey, name);
		var paddedValue = stringToPaddedBitArray(
			value,
			MAX_PASSWORD_LENGTH_BYTES
		);
		var values = bitArrayToHex(
			encryptwithGCM(this.keys.cipher, paddedValue, hmacDomain)
		);
		this.data.credentials[bitArrayToHex(hmacDomain)] = values;
	};

	remove (name) {
		if (this.state === KEYCHAIN_STATE_OFF) throw "Keychain not initialized.";
		var hmacDomain = bitArrayToHex(HMAC(this.keys.hmacKey, name));
		if (hmacDomain in this.data.credentials) {
			this.data.credentials = omit(this.data.credentials, [hmacDomain]);
			return true;
		}
		return false;
	};

};

module.exports.KeyChain = KeyChain;
