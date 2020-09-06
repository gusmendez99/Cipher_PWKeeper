import {
	HMAC, PBKDF2, SHA256, cipherState, decryptGCM, encryptGCM, generateRandomArray
} from "./keeper.cipher";
import {
	AES_KEY_LENGTH_BITS,
	KEYCHAIN_STATE_OFF,
	KEYCHAIN_STATE_ON,
	MAC_KEY_LENGTH_BITS,
	MAX_PASSWORD_LENGTH_BYTES,
	TOTAL_PASSWORD_LENGTH
} from './keeper.constants';

import * as keeperUtils from './keeper.utils'
import omit from 'lodash/omit';

class Keychain {
	// Instance variables
	constructor() {
		this.state = KEY
		this.keys = {
			salt = null,
			authKey = null,
			hmacKey = null,
			gcmKey = null
		}
		this.data = {}
	}

	init(password) {
		this.state = KEYCHAIN_STATE_OFF
		this.keys = {}
		this.data = {};

		const salt = generateRandomArray(AES_KEY_LENGTH_BITS);
		const master = PBKDF2(password, salt);

		const authKey = keeperUtils.sliceBitArray(
			HMAC(master, "secret auth pk"),
			0,
			AES_KEY_LENGTH_BITS
		);
		const hmacKey = keeperUtils.sliceBitArray(
			HMAC(master, "secret hmac pk"),
			0,
			MAC_KEY_LENGTH_BITS
		);
		const gcmKey = keeperUtils.sliceBitArray(
			HMAC(master, "secret gcm pk"),
			0,
			AES_KEY_LENGTH_BITS
		);

		this.keys = { salt, authKey, hmacKey, gcmKey }
		this.state = KEYCHAIN_STATE_ON
	};

	load(password, representation, trustedDataCheck) {
		this.state = KEYCHAIN_STATE_OFF

		const data = JSON.parse(representation);
		const { salt, authMessage } = data;
		const master = PBKDF2(password, salt);

		const authKey = sliceBitArray(
			HMAC(master, "secret auth pk"),
			0,
			AES_KEY_LENGTH_BITS
		);

		const cipher = cipherState(authKey);
		let decryptedText = ""

		try {
			decryptedText = decryptGCM(cipher, authMessage);
		} catch (err) {
			return false;
		}

		const isValidMessage = keeperUtils.compareBitArray(decryptedText, keeperUtils.stringToBitArray("authenticate"))
		if (!isValidMessage) return false;

		if (trustedDataCheck) {
			const hash = SHA256(keeperUtils.stringToBitArray(representation));
			const isValidHash = keeperUtils.compareBitArray(hash, trustedDataCheck)
			if (!isValidHash) throw "Representation and SHA256 hash have different values...";
		}

		const hmacKey = keeperUtils.sliceBitArray(
			HMAC(master, "secret hmac pk"),
			0,
			MAC_KEY_LENGTH_BITS
		);
		const gcmKey = keeperUtils.sliceBitArray(
			HMAC(master, "secret gcm pk"),
			0,
			AES_KEY_LENGTH_BITS
		);

		this.keys = { salt, gcmKey, hmacKey, authKey }

		const loadedData = JSON.parse(representation);
		this.data = omit(loadedData, ['salt', 'authMessage'])
		this.state = KEYCHAIN_STATE_ON

		return true;
	};

	get(name) {
		if (this.state == KEYCHAIN_STATE_OFF) throw "Keychain state must be initialized...";

		const { authKey, gcmKey } = this.keys
		const hmacDomain = HMAC(authKey, name);
		if (!(hmacDomain in this.data)) return null;

		const encrypted = this.data[hmacDomain];
		const decryptedBits = decryptGCM(cipherState(gcmKey), encrypted);
		const paddedPassword = keeperUtils.sliceBitArray(
			decryptedBits,
			0,
			TOTAL_PASSWORD_LENGTH * 8
		);

		const decryptedPassword = keeperUtils.paddedBitArrayToString(
			paddedPassword,
			MAX_PASSWORD_LENGTH_BYTES + 1
		);

		const isSwapped = !keeperUtils.compareBitArray(
			hmacDomain,
			keeperUtils.sliceBitArray(
				decryptedBits,
				TOTAL_PASSWORD_LENGTH * 8,
				keeperUtils.getBitArrayLength(decryptedBits)
			)
		)

		if (isSwapped) throw "Swapping attack...";
		return decryptedPassword;
	};

	set(name, value) {
		if (this.state == KEYCHAIN_STATE_OFF) throw "Keychain state must be initialized...";

		const { hmacKey, gcmKey } = this.keys;
		const hmacDomain = HMAC(hmacKey, name);
		const paddedBits = keeperUtils.paddedBitArrayToString(value, MAX_PASSWORD_LENGTH_BYTES + 1);

		const textToEncrypt = keeperUtils.concatBitArrays(paddedBits, hmacDomain);
		const encryptedValue = encryptGCM(cipherState(gcmKey), textToEncrypt);
		this.data[hmacDomain] = encryptedValue;
	}

	remove(name) {
		if (this.state == KEYCHAIN_STATE_OFF) throw "Keychain state must be initialized...";
		const { hmacKey } = this.keys;
		const hmacDomain = HMAC(hmacKey, name);

		if (hmacDomain in this.data) {
			this.data = omit(this.data, [hmacDomain]);
			return true;
		}
		return false;
	}

	dump() {
		if (this.state == KEYCHAIN_STATE_OFF) return null;

		const { authKey } = this.keys;
		const encryptedMessage = encryptGCM(cipherState(authKey), keeperUtils.stringToBitArray("authenticate"));
		const currentData = { ...JSON.parse(JSON.stringify(this.data)), salt: this.keys.salt, authMessage: encryptedMessage };

		const hash = SHA256(keeperUtils.stringToBitArray(JSON.stringify(currentData)));
		return [JSON.stringify(currentData), hash];
	}

};
