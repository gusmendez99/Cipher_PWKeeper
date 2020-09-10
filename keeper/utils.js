var sjcl = require("sjcl");

var PBKDF2 = function (password, salt) {
	return sjcl.misc.pbkdf2(password, salt, 50000);
};

var HMAC = function (key, data) {
	return new sjcl.misc.hmac(key).encrypt(data);
};

var SHA256 = function (array) {
	return sjcl.hash.sha256.hash(array);
};

var setupCipher = function (secretKey) {
	if (getBitArrayLength(secretKey) === 128) {
		return new sjcl.cipher.aes(secretKey);
	}
	throw "setupCipher: only accepts keys for AES-128";
};

var encryptWithGCM = function (cipher, plaintext, authenticatedData) {
	var iv = randomBitArray(128);
	var v = sjcl.mode.gcm.encrypt(cipher, plaintext, iv, authenticatedData);
	var ciphertext = sjcl.bitArray.concat(iv, v);
	return ciphertext;
};

var decryptWithGCM = function (cipher, ciphertext, authenticatedData) {
	var iv = sjcl.bitArray.bitSlice(ciphertext, 0, 128);
	var c = sjcl.bitArray.bitSlice(ciphertext, 128);
	return sjcl.mode.gcm.decrypt(cipher, c, iv, authenticatedData);
};

var bitArraySlice = function (array, array, b) {
	return sjcl.bitArray.bitSlice(array, array, b);
};

var bitArrayToString = function (array) {
	return sjcl.codec.utf8String.fromBits(array);
};

var stringToBitArray = function (str) {
	return sjcl.codec.utf8String.toBits(str);
};

var bitArrayToHex = function (array) {
	return sjcl.codec.hex.fromBits(array);
};

var hexToBitArray = function (hexStr) {
	return sjcl.codec.hex.toBits(hexStr);
};

var bitArrayToBase64 = function (array) {
	return sjcl.codec.base64.fromBits(array);
};

var base64ToBitArray = function (base64Str) {
	return sjcl.codec.base64.toBits(base64Str);
};

var byteArrayToHex = function (array) {
	var string = "";
	for (var i = 0; i < array.length; i++) {
		if (array[i] < 0 || array[i] >= 256) {
			throw "Value out of byte range";
		}
		string += ((array[i] | 0) + 256).toString(16).substr(1);
	}
	return string;
};

var hexToByteArray = function (string) {
	var array = [];
	if (string.length % 2 != 0) {
		throw "String has odd length";
	}
	for (var i = 0; i < string.length; i += 2) {
		array.push(parseInt(string.substr(i, 2), 16) | 0);
	}
	return array;
};

var wordToBytesAcc = function (word, bytes) {
	if (word < 0) {
		throw "Is negative integer";
	}
	for (var i = 0; i < 4; i++) {
		bytes.push(word & 0xff);
		word = word >>> 8;
	}
};

var wordFromBytesSub = function (bytes, indexStart) {
	if (!Array.isArray(bytes)) {
		throw "Bytes is non-array";
	}
	if (bytes.length < 4) {
		throw "Bytes is a too short array";
	}
	var word = 0;
	for (var i = indexStart + 3; i >= indexStart; i--) {
		word <<= 8;
		word |= bytes[i];
	}
	return word;
};

var stringToPaddedByteArray = function (inputStr, paddedLength) {
	if (typeof inputStr !== "string") {
		throw "Non-string value";
	}
	var string = unescape(encodeURIComponent(inputStr));
	var length = string.length;
	if (length > paddedLength) {
		throw "String is too long";
	}
	var bytes = [];
	wordToBytesAcc(length, bytes);
	for (var i = 0; i < paddedLength; i++) {
		if (i < length) {
			bytes.push(string.charCodeAt(i));
		} else {
			bytes.push(0);
		}
	}
	return bytes;
};

var stringToPaddedBitArray = function (inputStr, paddedLength) {
	return sjcl.codec.hex.toBits(
		byteArrayToHex(stringToPaddedByteArray(inputStr, paddedLength))
	);
};

var paddedByteArrayToString = function (array, paddedLength) {
	if (array.length != paddedLength + 4) {
		throw "Wrong length";
	}
	var length = wordFromBytesSub(array, 0);
	var string = "";
	for (var i = 4; i < Math.min(4 + length, array.length); i++) {
		string += String.fromCharCode(array[i]);
	}
	return decodeURIComponent(escape(string));
};

var paddedBitArrayToString = function (array, paddedLength) {
	return paddedByteArrayToString(
		hexToByteArray(sjcl.codec.hex.fromBits(array)),
		paddedLength
	);
};

var randomBitArray = function (length) {
	if (length % 32 === 0) {
		return sjcl.random.randomWords(length / 32, 0);
	}
	throw "Length not divisible by 32";
};

var compareBitArrays = function (firstArray, secondArray) {
	return sjcl.bitArray.equal(firstArray, secondArray);
};

var getBitArrayLength = function (array) {
	return sjcl.bitArray.bitLength(array);
};

var concatBitArray = function (firstArray, secondArray) {
	return sjcl.bitArray.concat(firstArray, secondArray);
};

var objectHasKey = function (obj, key) {
	return obj.hasOwnProperty(key);
};

module.exports = {
	PBKDF2: PBKDF2,
	HMAC: HMAC,
	SHA256: SHA256,
	setupCipher: setupCipher,
	encryptwithGCM: encryptWithGCM,
	decryptWithGCM: decryptWithGCM,
	bitArraySlice: bitArraySlice,
	bitArrayToString: bitArrayToString,
	stringToBitArray: stringToBitArray,
	bitArrayToBase64: bitArrayToBase64,
	base64ToBitArray: base64ToBitArray,
	stringToPaddedBitArray: stringToPaddedBitArray,
	paddedBitArrayToString: paddedBitArrayToString,
	randomBitArray: randomBitArray,
	compareBitArrays: compareBitArrays,
	getBitArrayLength: getBitArrayLength,
	concatBitArray: concatBitArray,
	objectHasKey: objectHasKey,
	bitArrayToHex: bitArrayToHex,
	hexToBitArray: hexToBitArray
};
