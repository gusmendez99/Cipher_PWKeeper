var keychainModule = require("../keeper/keychain");

const keyChainClass = keychainModule.keychain;

const keychain = new keyChainClass();

const postInit = (request, response) => {
  const password = request.body;

  keychain.init(password);

  if (keychain.keys.salt === null && keychain.keys.authKey === null 
    && keychain.keys.hmacKey === null && keychain.keys.gcmKey === null){
    response.status(400).json("{ error: Keychain failed to be initialized}")
  }
  response.status(200).json("{ message: keychain initialized successfully }");
};

const postSet = (request, response) => {
  const {name, value} = request.body;
  if (name === "" || value === ""){
    response.status(400).json("{ error: Name and value must not be empty}")
  }
  keychain.set(name,value)
  response.status(200).json("message: Set executed correctly");
};

module.exports = {
  postInit,
  postSet
}