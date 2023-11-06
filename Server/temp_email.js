const crypto = require('crypto');
const https = require('https');


/**
 * @type {string}
 * @const
 */
const API_URL = 'https://api.temp-mail.ru';

/**
 * Makes GET request
 * @param {string} url
 * @returns {Promise}
 */
function get(url) {
  return new Promise((resolve, reject) => {
    https
    .get(url, (res) => {
    if (res.statusCode < 200 || res.statusCode > 299) {
        if (res.statusCode === 301 || res.statusCode === 302) {
            const redirectUrl = res.headers.location;
            if (redirectUrl) {
            // Make a new request to the redirected URL
                https.get(redirectUrl, (redirectRes) => {
                    let data = '';

                    redirectRes
                    .on('data', (chunk) => { data += chunk; })
                    .on('end', () => resolve(data));
                })
                .on('error', reject);

                return; // Exit the function to prevent the original request from continuing
            }
        }

      reject(new Error(`Request failed: ${res.statusCode}`));
      return; // Exit the function to prevent the rest of the code from executing
    }

    let data = '';

    res
      .on('data', (chunk) => { data += chunk; })
      .on('end', () => resolve(data));
  })
  .on('error', reject);
  });
}

/**
 * Generates MD5 hash from email
 * @param {string} email
 * @returns {string}
 */
function getEmailHash(email) {
  return crypto.createHash('md5').update(email).digest('hex');
}

/**
 * Generates random email in given domains
 * @param {Array} domains
 * @param {number} [len=7]
 * @param {string} prefix
 * @returns {string}
 */
function getRandomEmail(domains, len = 7, prefix = '') {
  const alfabet = '1234567890abcdefghijklmnopqrstuvwxyz';

  let name = !prefix ? '' : `${prefix}-`;

  for (let i = 0; i < len; i++) {
    const randomChar = Math.round(Math.random() * (alfabet.length - 1));
    name += alfabet.charAt(randomChar);
  }

  const domain = domains[Math.floor(Math.random() * domains.length)];

  return name + domain;
}

/**
 * Receives available domains
 * @returns {Promise.<Array, Error>}
 */
function getAvailableDomains() {
  return get(`${API_URL}/request/domains/format/json/`).then(JSON.parse);
}

/**
 * Generates email on temp-mail.ru
 * @param {number} [len]
 * @param {string} prefix
 * @returns {Promise.<String, Error>}
 */
function generateEmail(len, prefix) {
  return getAvailableDomains()
    .then(availableDomains => getRandomEmail(availableDomains, len, prefix));
}

/**
 * Receives inbox from temp-mail.ru
 * @param {string} email
 * @returns {Promise.<(Object|Array), Error>}
 */
function getInbox(email) {
  if (!email) {
    throw new Error('Please specify email');
  }

//   return get(`${API_URL}/request/mail/id/${getEmailHash(email)}/messages/format/json/`).then(JSON.parse);
//   return get(`${API_URL}/request/mail/id/65481acde89958036146a6be/format/json/`).then(JSON.parse);
  return get(`${API_URL}/request/mail/id/65481acde89958036146a6be/format/json/`).then(JSON.parse);


}

function deleteMail(mailId) {
  return new Promise((resolve, reject) => {
    if (!mailId) {
      return reject('Please specify mail identifier');
    }

    return get(`${API_URL}/request/delete/id/${mailId}/format/json/`).then(JSON.parse);
  });
}

module.exports = { generateEmail, getInbox, deleteMail };