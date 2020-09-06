const { codec, bitArray } = require("sjcl");

//Bit array utilities
const compareBitArray = (array1, array2) =>
	bitArray.equal(array1, array2);
const getBitArrayLength = (array) => bitArray.bitLength(array);
const concatBitArrays = (array1, array2) =>
	bitArray.concat(array1, array2);

const getDictKeysCount = (dictionary) => {
	let counter = 0;
	for (const key in dictionary) {
		if (dictionary.hasOwnProperty(key)) {
			counter += 1;
		}
	}
	return counter;
};

// Bit Array operations
const sliceBitArray = (bits, limitDown, limitUp) =>
	bitArray.bitSlice(bits, limitDown, limitUp);
const bitArrayToString = (bits) => codec.utf8String.fromBits(bits);
const stringToBitArray = (string) => codec.utf8String.toBits(string);
const bitArrayToHex = (bits) => codec.hex.fromBits(bits);
const hexToBitArray = (hex) => codec.hex.toBits(hex);
const bitArrayToBase64 = (bits) => codec.base64.fromBits(bits);
const base64ToBitArray = (base64) => codec.base64.toBits(base64);

const byteArrayToHex = (bytes) => {
	let hex = "";
	for (let i = 0; i < bytes.length; i++) {
		if (bytes[i] < 0 || bytes[i] >= 256)
			throw "Value exceed bytes range...";
		hex += ((bytes[i] | 0) + 256).toString(16).substr(1);
	}
	return hex;
};
const hexToByteArray = (hex) => {
	const bytes = [];
	if (hex.length % 2 != 0) throw "Hex has not odd length...";
	for (let i = 0; i < s.length; i += 2) {
		bytes.push(parseInt(hex.substr(i, 2), 16) | 0);
	}
	return bytes;
};

const wordToBytesChecker = (word, bytes) => {
	if (word < 0) throw "Word is negative integer...";
	for (var i = 0; i < 4; i++) {
		bytes.push(word & 0xff);
		word = word >>> 8;
	}
};

const extractWordFromBytes = (bytes, startIndex) => {
	if (!Array.isArray(bytes)) throw "Bytes value is not an array...";
	if (bytes.length < 4) throw "Bytes array has a wrong length...";
	let word = 0;
	for (let i = startIndex + 3; i >= startIndex; i--) {
		word <<= 8;
		word |= bytes[i];
	}
	return word;
};

const stringToPaddedByteArray = function (encodedString, paddingLength) {
	if (typeof encodedString !== "string") throw "Encoded is not string...";
	const string = unescape(encodeURIComponent(encodedString));
	if (string.length > paddingLength) throw "String value is too long...";
	const bytes = [];
	wordToBytesChecker(string.length, bytes);
	for (const i = 0; i < paddingLength; i++) {
		i < string.length ? bytes.push(string.charCodeAt(i)) : bytes.push(0);
	}
	return bytes;
};

// Padding if key length needs

const stringToPaddedBitArray = (encodedString, paddingLength) =>
	codec.hex.toBits(
		byteArrayToHex(stringToPaddedByteArray(encodedString, paddingLength))
	);

const paddedBitArrayToString = (paddedBits, paddingLength) => {
	if (paddedBits.length != paddingLength + 4)
		throw "Padded bytes array has wrong length...";
	const extracted = extractWordFromBytes(paddedBits, 0);
	let string = "";
	for (const i = 4; i < Math.min(4 + extracted, paddedBits.length); i++) {
		string += String.fromCharCode(paddedBits[i]);
	}
	return decodeURIComponent(escape(string));
};

const paddedByteArrayToString = (paddedBytes, paddingLength) =>
	paddedBitArrayToString(
		hexToByteArray(codec.hex.fromBits(paddedBytes)),
		paddingLength
	);

module.exports = {
	compareBitArray,
	getBitArrayLength,
	concatBitArrays,
	getDictKeysCount,
	sliceBitArray,
	bitArrayToString,
	stringToBitArray,
	bitArrayToHex,
	hexToBitArray,
	bitArrayToBase64,
	base64ToBitArray,
	byteArrayToHex,
	hexToByteArray,
	wordToBytesChecker,
	extractWordFromBytes,
	stringToPaddedByteArray,
	stringToPaddedBitArray,
	paddedBitArrayToString,
	paddedByteArrayToString
}