// import axios from 'axios';

function submitForm() {
  //   const axios = require('axios');
  const lastname = document.getElementById('lastname').value;
  const firstname = document.getElementById('firstname').value;
  const othername = document.getElementById('othername').value;
  const idnumber = document.getElementById('idnumber').value;
  const phone = document.getElementById('phone').value;
  const email = document.getElementById('email').value;
  //   const photo = document.getElementById('photo').value;
  const photo = $('#photo').prop('files')[0];

  $.post({
    url: '/voters',
    data: {
      lastname: lastname,
      firstname: firstname,
      othername: othername,
      idnumber: idnumber,
      phone: phone,
      email: email,
      photo: photo,
    },
  })
    .then((res) => {
      console.log(res.data);
    })
    .catch((error) => {
      console.log(error);
    });
}
