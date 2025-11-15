function person(name, callback) {
  console.log("Person function called");
  console.log("Name:", name);
  callback();
}

function address() {
  console.log("Address function called");
}

person("Muralidharan", address);
