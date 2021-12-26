/* ------------ Selectors ------------ */

const regForm = document.querySelector('#regForm');
const userList = document.querySelector('#userList');

/* Variables */
let editModeOn = false;
let currentUserId;
const users = initLocal();

/* ------------ Functions ------------ */

/// DATA RELATED FUNCTIONS ///

// Add user
const addUser = (userToAdd) => {
  addToLocal(userToAdd);
  return users.push(userToAdd);
};

// Update user
const updateUser = (userToUpdate) => {
  const userIndex = findUserIndex(userToUpdate.id);

  users[userIndex] = userToUpdate;
  updateLocal();
  updateList();

  return true;
};

// Delete user
const deleteUser = (userId) => {
  users.splice(0, users.length, ...filterOutUser(users, userId));
  removeFromLocal(userId);
  return users;
};

// Find user Index
const findUserIndex = (userId) => {
  return users.findIndex((user) => user.id === userId);
};

/// LIST RELATED FUNCTIONS ///

// Add list-item
const addListItem = (user) => {
  // Create the elements and structure for a list item with data from the
  // current user and append it to the list

  let li = document.createElement('li');
  li.classList.add('user');

  let userIconDiv = document.createElement('div');
  userIconDiv.classList.add('user-icon');

  let userIcon = document.createElement('i');
  userIcon.classList.add('fas', 'fa-user');

  let userContent = document.createElement('div');
  userContent.classList.add('user-content');

  let userName = document.createElement('p');
  userName.classList.add('user-name');

  let userEmail = document.createElement('p');
  userEmail.classList.add('user-email');

  let listButtons = document.createElement('div');
  listButtons.classList.add('list-buttons');

  let btnEdit = document.createElement('button');
  btnEdit.classList.add('btn-edit');

  let btnEditIcon = document.createElement('i');
  btnEditIcon.classList.add('fas', 'fa-edit');

  let btnRemove = document.createElement('button');
  btnRemove.classList.add('btn-remove');

  let btnRemoveIcon = document.createElement('i');
  btnRemoveIcon.classList.add('fas', 'fa-trash');

  // Append elements

  userList.appendChild(li);

  li.appendChild(userIconDiv);
  li.appendChild(userContent);
  li.appendChild(listButtons);

  userIconDiv.appendChild(userIcon);

  userContent.appendChild(userName);
  userContent.appendChild(userEmail);

  listButtons.appendChild(btnEdit);
  listButtons.appendChild(btnRemove);

  btnEdit.appendChild(btnEditIcon);
  btnRemove.appendChild(btnRemoveIcon);

  // Add data to new list-item
  li.id = user.id;
  userName.innerText = `${user.firstName} ${user.lastName}`;
  userEmail.innerText = user.email;
};

// Clear list
const clearList = () => {
  let listArray = [...userList.children];
  listArray.forEach((child) => child.remove());
};

// Update list
const updateList = () => {
  clearList();
  users.forEach((user) => {
    addListItem(user);
  });
};

updateList();

/// HELP FUNCTIONS ///

// Clear form
const clearForm = () => {
  regForm.children[1].children[1].value = '';
  regForm.children[2].children[1].value = '';
  regForm.children[3].children[1].value = '';
};

//Enter edit mode
const enterEditMode = () => {
  removeAllWarnings();

  if (!editModeOn) {
    editModeOn = true;
    regForm.children[0].innerText = 'Update user';
    regForm.children[4].innerText = 'Save';
    let editButton = document.querySelector(`#${currentUserId}`).children[2]
      .children[0];

    editButton.classList.remove('btn-edit');
    editButton.classList.add('btn-cancel');
  }
};

// Exit edit mode
const exitEditMode = (listItemId) => {
  removeAllWarnings();

  if (editModeOn) {
    editModeOn = false;
    regForm.children[0].innerText = 'Register user';
    regForm.children[4].innerText = 'Register';
    let cancelButton = document.querySelector(`#${currentUserId}`).children[2]
      .children[0];

    cancelButton.classList.remove('btn-cancel');
    cancelButton.classList.add('btn-edit');
    clearForm();
  }
};

// Check string for special characters
function hasSpecial(inputString) {
  return /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(inputString);
}

// Check string for numbers
function hasNumber(inputString) {
  return /\d/.test(inputString);
}

// Validate text
const validateText = (input) => {
  switch (true) {
    case hasNumber(input):
      return { success: false, msg: "You can't use numbers in your name" };

    case input === '':
      return { success: false, msg: 'Please enter a name' };

    case input.length < 2:
      return {
        success: false,
        msg: 'Your name needs to longer than 1 character',
      };

    case hasSpecial(input):
      return {
        success: false,
        msg: 'No special characters are allowed in your name',
      };

    default:
      return { success: true, msg: input };
  }
};

// Validate email
const validateEmail = (inputEmail) => {
  const regex =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

  if (!regex.test(inputEmail)) {
    return { success: false, msg: 'You must enter a valid email adress' };
  }
  return { success: true, msg: inputEmail };
};

// Check if email is unique
const isEmailUnique = (targetArray, email) => {
  for (user of targetArray) {
    if (user.email === email) {
      return false;
    }
  }
  return true;
};

// Generate ID
const generateId = () => {
  return `id-${Math.floor(Math.random() * Date.now())}`;
};

// Filter out user from array
const filterOutUser = (targetArray, userId) => {
  return targetArray.filter((user) => user.id !== userId);
};

// Show Warning message
const showWarningMsg = (element, message) => {
  element.classList.add('error');
  element.setAttribute('data-error', message);
};

// Show Warning Icon
const showWarningicon = (element) => {
  element.classList.add('error-icon');
};

// Remove single Warning
const removeWarning = (element) => {
  element.classList.remove('error-icon', 'error');
  delete element.dataset.error;
};

// Remove all warnings
const removeAllWarnings = () => {
  elements = [...regForm.children];
  elements.forEach((element) => {
    removeWarning(element);
  });
};

/// LOCAL STORAGE RELATED FUNCTIONS ///

//Initialize local storage
function initLocal() {
  let usersArray;
  if (localStorage.getItem('users') === null) {
    usersArray = [];
  } else {
    usersArray = JSON.parse(localStorage.getItem('users'));
  }

  return usersArray;
}

// Add to local storage
const addToLocal = (user) => {
  let usersArray = initLocal();

  usersArray.push(user);
  localStorage.setItem('users', JSON.stringify(usersArray));
};

// Delete from local storage
const removeFromLocal = (user) => {
  let usersArray = initLocal();

  usersArray = filterOutUser(usersArray, user);
  localStorage.setItem('users', JSON.stringify(usersArray));
};

//Update local storage
const updateLocal = () => {
  localStorage.setItem('users', JSON.stringify(users));
};

/* ------------ Events ------------ */

// Register/Edit event

regForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let newUser;
  const errors = [];

  // Validate inputs
  for (let i = 0; i < e.currentTarget.length; i++) {
    if (e.currentTarget[i].type === 'text') {
      // Validate text
      let validation = validateText(e.currentTarget[i].value);

      if (!validation.success) {
        //Save error element and message
        errors.push({ element: e.currentTarget[i], msg: validation.msg });
      } else {
        removeWarning(e.currentTarget[i].parentNode);
      }
    } else if (e.currentTarget[i].type === 'email') {
      // Validate Email
      let validation = validateEmail(e.currentTarget[i].value);

      if (!validation.success) {
        //Save error element and message
        errors.push({ element: e.currentTarget[i], msg: validation.msg });
      } else {
        removeWarning(e.currentTarget[i].parentNode);
      }

      // Exclude or include the user from the array when validating email depending on if edit-mode is on/off
      if (editModeOn) {
        // Make sure the user can't change email to one that already exist in the database
        if (!isEmailUnique(
            filterOutUser(users, currentUserId),
            e.currentTarget[i].value
          )) {
          errors.push({
            element: e.currentTarget[i],
            msg: 'This email already exists',
          });
        }
      } else {
        // Check if the email is unique
        if (!isEmailUnique(users, e.currentTarget[i].value)) {
          errors.push({
            element: e.currentTarget[i],
            msg: 'This email already exists',
          });
        }
      }
    }
  }

  // Show all the errors at their respective element locations if there are any
  if (errors.length !== 0) {
    errors.forEach((error) => {
      showWarningMsg(error.element.parentNode, error.msg);
      showWarningicon(error.element.parentNode);
    });

    errors[0].element.focus();
    //console.log(errors);
    return false;
  }

  if (editModeOn) {
    //Update the selected user with the new input-data
    updateUser({
      id: currentUserId,
      firstName: e.currentTarget.firstName.value,
      lastName: e.currentTarget.lastName.value,
      email: e.currentTarget.email.value,
    });

    exitEditMode(currentUserId);
  } else {
    //Generate a new user from the input-data
    newUser = {
      id: generateId(),
      firstName: e.currentTarget.firstName.value,
      lastName: e.currentTarget.lastName.value,
      email: e.currentTarget.email.value,
    };

    // Add user to user array
    addUser(newUser);
    addListItem(newUser);
  }

  for (let i = 0; i < e.currentTarget.length; i++) {
    e.currentTarget[i].value = '';
    e.currentTarget[i].blur();
  }
});

// Validate inputs while the user is typing
regForm.addEventListener('keyup', (e) => {
  if (e.target.type === 'text') {
    // Validate text
    let validation = validateText(e.target.value);
    if (!validation.success) {
      showWarningicon(e.target.parentNode);
    } else {
      removeWarning(e.target.parentNode);
    }
  } else if (e.target.type === 'email') {
    // Validate Email
    let validation = validateEmail(e.target.value);

    if (!validation.success) {
      showWarningicon(e.target.parentNode);
    } else {
      removeWarning(e.target.parentNode);
    }

    // Exclude of include the user from the array when validating depending on if edit-mode is on/off
    if (editModeOn) {
      // Make sure the user can't change email to one that already exist in the database
      if (!isEmailUnique(filterOutUser(users, currentUserId), e.target.value)) {
        showWarningicon(e.target.parentNode);
        showWarningMsg(e.target.parentNode, 'This email already exists');
      }
    } else {
      // Check if the email is unique
      if (!isEmailUnique(users, e.target.value)) {
        showWarningicon(e.target.parentNode);
        showWarningMsg(e.target.parentNode, 'This email already exists');
      } else {
        removeWarning(e.target.parentNode);
      }
    }
  }
});

userList.addEventListener('click', (e) => {
  const clicked = e.target;
  const listItem = clicked.parentNode.parentNode;
  //console.log(clicked);

  // Cancel edit mode
  if (clicked.classList.contains('btn-cancel')) {
    exitEditMode(currentUserId);

    // Edit list item
  } else if (clicked.classList.contains('btn-edit')) {
    // If we are trying to edit a new user while currentrly editing a user
    // we will cancel the edit on the previous user before entering edit mode again
    if (editModeOn && currentUserId !== listItem.id) {
      exitEditMode(currentUserId);
    }

    // Set the current user id to the user we want to edit
    currentUserId = listItem.id;
    enterEditMode(currentUserId);

    // Gather the data from the user and send it to the form
    const fName = listItem.children[1].children[0].innerText.split(' ')[0];
    const lName = listItem.children[1].children[0].innerText.split(' ')[1];
    const email = listItem.children[1].children[1].innerText;

    regForm.children[1].children[1].value = fName;
    regForm.children[2].children[1].value = lName;
    regForm.children[3].children[1].value = email;
  }

  // Delete list item event
  if (clicked.classList.contains('btn-remove')) {
    if (editModeOn) {
      exitEditMode(currentUserId);
    }

    deleteUser(listItem.id);
    listItem.remove();
  }
});