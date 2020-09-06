var keychainModule = require("../keeper/keychain");

const keyChainClass = keychainModule.keychain;

const Keychain = new keyChainClass();

const postInit = (request, response) => {
  console.log(Keychain)
  response.status(200).json("{}");
};

module.exports = {
  postInit
}