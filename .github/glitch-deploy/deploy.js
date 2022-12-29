const upload_Md = require('./git-push.js');
const createNew_Md = require('./newCreate.js')
const shell = require('shelljs')
const queryString = require('query-string');
const axios = require("axios").default;
const axiosRetry = require('axios-retry');

setTimeout(() => {
  console.log('force exit');
  process.exit(0)
}, 30 * 60 * 1000);

axiosRetry(axios, {
  retries: 100,
  retryDelay: (retryCount) => {
    // console.log(`retry attempt: ${retryCount}`);
    return 3000 || retryCount * 1000;
  },
  retryCondition: (error) => {
    return error.response.status === 502;
  },
});


const listProject = `https://ae6f0fb3-73a1-4ec6-83d1-67d91ba86762@api.glitch.com/git/foremost-dog-rule|https://ae6f0fb3-73a1-4ec6-83d1-67d91ba86762@api.glitch.com/git/fluorescent-melon-meter|https://ae6f0fb3-73a1-4ec6-83d1-67d91ba86762@api.glitch.com/git/fortune-lapis-nitrogen|https://ae6f0fb3-73a1-4ec6-83d1-67d91ba86762@api.glitch.com/git/fire-neighborly-pawpaw|https://ae6f0fb3-73a1-4ec6-83d1-67d91ba86762@api.glitch.com/git/fluoridated-small-axolotl|https://ae6f0fb3-73a1-4ec6-83d1-67d91ba86762@api.glitch.com/git/better-witty-hip|https://ae6f0fb3-73a1-4ec6-83d1-67d91ba86762@api.glitch.com/git/foam-blush-lasagna|https://ae6f0fb3-73a1-4ec6-83d1-67d91ba86762@api.glitch.com/git/happy-educated-doll|https://ae6f0fb3-73a1-4ec6-83d1-67d91ba86762@api.glitch.com/git/fair-marvelous-colony|https://ae6f0fb3-73a1-4ec6-83d1-67d91ba86762@api.glitch.com/git/crystal-abiding-adapter|https://ae6f0fb3-73a1-4ec6-83d1-67d91ba86762@api.glitch.com/git/proud-pastoral-cause|https://ae6f0fb3-73a1-4ec6-83d1-67d91ba86762@api.glitch.com/git/halved-blossom-surf|https://ae6f0fb3-73a1-4ec6-83d1-67d91ba86762@api.glitch.com/git/woolen-emerald-party|https://ae6f0fb3-73a1-4ec6-83d1-67d91ba86762@api.glitch.com/git/attractive-rowan-stone`.trim().split('|');

const delay = t => {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(true);
    }, t);
  });
};

(async () => {
  try {
    let accountNumber = 0;

    for (let i = 0; i < listProject.length; i++) {
      accountNumber = i + 1;
      try {
        const nameProject = listProject[i].split('/')[4]
        console.log('deploy', nameProject);
        createNew_Md.run(nameProject)
        await upload_Md.upload2Git(listProject[i].trim(), 'code4Delpoy');
        console.log(`account ${accountNumber} upload success ^_^`);

        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' true'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });

        if (i + 1 < listProject.length) await delay(1.8 * 60 * 1000);
      } catch (error) {
        console.log(`account ${accountNumber} upload fail ^_^`);
        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' false'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });
      }

      if (process.cwd().includes('code4Delpoy')) shell.cd('../', { silent: true });

    }

    await delay(20000)
    console.log('Done! exit')
    process.exit(0)

  } catch (err) {
    console.log(`error: ${err}`);
  }
})();