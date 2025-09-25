document.addEventListener("DOMContentLoaded", function () {
    const fetchBtn = document.getElementById("fetchBtn");
    const userCountInput = document.getElementById("userCount");
    const userTableBody = document.querySelector("#userTable tbody");
    const nameTypeSelect = document.getElementById("nameType");
    const errorMsg = document.getElementById("errorMsg");
  
    let usersData = [];
    const API_URL = "http://localhost:3000/"; 

    function fetchUsers(count) {
      return new Promise(function (resolve, reject) {
        fetch(API_URL + "?results=" + count)
          .then(function (res) {
            if (!res.ok) {
              reject("Error fetching data");
            }
            return res.json();
          })
          .then(function (data) {
            resolve(data.results);
          })
          .catch(function () {
            reject("Network error");
          });
      });
    }
  
    function displayUsers() {
      userTableBody.innerHTML = ""; 
      const nameType = nameTypeSelect.value;
  
      for (let i = 0; i < usersData.length; i++) {
        const user = usersData[i];
        const row = "<tr>" +
          "<td>" + (nameType === "first" ? user.name.first : user.name.last) + "</td>" +
          "<td>" + user.gender + "</td>" +
          "<td>" + user.email + "</td>" +
          "<td>" + user.location.country + "</td>" +
          "</tr>";
        userTableBody.innerHTML += row; 
      }
    }
  
    fetchBtn.addEventListener("click", function () {
      const count = parseInt(userCountInput.value);
  
      if (isNaN(count) || count < 0 || count > 1000) {
        errorMsg.textContent = "Please enter a number from 0 to 1000";
        return;
      }
  
      if (count === 0) {
        usersData = [];
        displayUsers();
        errorMsg.textContent = "No users to show";
        return;
      }
  
      errorMsg.textContent = "Loading...";
  
      fetchUsers(count)
        .then(function (users) {
          usersData = users;
          displayUsers();
          errorMsg.textContent = "";
        })
        .catch(function (err) {
          errorMsg.textContent = err;
        });
    });
  
    nameTypeSelect.addEventListener("change", function () {
      displayUsers();
    });
  });
  