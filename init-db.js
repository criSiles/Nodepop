// Initialize the database with the minimum data to work

const readline = require("readline");

// Upload the model

const Advertisement = require("./models/Advertisement");

async function main() {
  // Ask the user if is sure
  const carryOn = await askingYN(
    "Are you sure to want to delete the database? [yes/no] \n"
  );
  if (!carryOn) {
      console.log("Cancelling");
    process.exit();
  }

  console.log("Conect to the database");
  const connection = require("./lib/connectMongoose");

  // Initialize the advertisements collection
  await initAdvertisement();

  // Disconnect to the database
  connection.close();
}

main().catch((err) => console.log("There was an error", err));

async function initAdvertisement() {
  // Delete all the documents of the previous ads collection
  const result = await Advertisement.deleteMany();
  console.log(`Deleted ${result.deletedCount} ads.`);

  // Open a JSON file with the ads
  const ads = require("./ads.json");

    // Create initial ads
  const inserted = await Advertisement.insertMany(ads);

  console.log(`Created ${inserted.length} ads.`);
}

function askingYN(text) {
    return new Promise((resolve, reject) => {
      const interface = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      interface.question(text, myResponse => {
        interface.close();
        if (myResponse.toLowerCase() === 'yes') {
          resolve(true);
          return;
        }
        resolve(false);
      })
    })
}
