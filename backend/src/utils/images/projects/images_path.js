function getAllCarWashImages() {
  const images = [];
  for (let i = 1; i <= 16; i++) {
    images.push(require("./car_wash/car_wash_" + i + ".jpg"));
  }
  return images;
}

function getAllHomeAutomationImages() {
  const images = [];
  for (let i = 1; i <= 13; i++) {
    images.push(require("./home_automation/home_automation_" + i + ".jpg"));
  }
  return images;
}
function getAllHomeManagementImages() {
  const images = [];
  for (let i = 1; i <= 7; i++) {
    images.push(require("./home_management/home_management_" + i + ".jpg"));
  }
  return images;
}

function getAllMeditationClubImages() {
  const images = [];
  for (let i = 1; i <= 16; i++) {
    images.push(require("./meditation_club_app/club_app_" + i + ".jpg"));
  }
  return images;
}
function getAllRecipeBookImages() {
  const images = [];
  for (let i = 1; i <= 7; i++) {
    images.push(require("./recipe_book/recipe_book_" + i + ".jpg"));
  }
  return images;
}

function getAllWatsappReplicaImages() {
  const images = [];
  for (let i = 1; i <= 7; i++) {
    images.push(require("./watsapp_replica/watsapp_replica_" + i + ".jpg"));
  }
  return images;
}

export const allImages = {getAllCarWashImages , getAllHomeAutomationImages , getAllHomeManagementImages , getAllMeditationClubImages , getAllRecipeBookImages , getAllWatsappReplicaImages}
