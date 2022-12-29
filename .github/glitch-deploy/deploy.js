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


const listProject = `https://3921b1b6-3a0a-4d56-bd42-eef60c831385@api.glitch.com/git/thorn-delightful-sneezeweed|https://3921b1b6-3a0a-4d56-bd42-eef60c831385@api.glitch.com/git/lilac-pentagonal-archduchess|https://3921b1b6-3a0a-4d56-bd42-eef60c831385@api.glitch.com/git/efficient-heavy-throat|https://3921b1b6-3a0a-4d56-bd42-eef60c831385@api.glitch.com/git/fork-lake-playroom|https://3921b1b6-3a0a-4d56-bd42-eef60c831385@api.glitch.com/git/storm-broadleaf-andesaurus|https://3921b1b6-3a0a-4d56-bd42-eef60c831385@api.glitch.com/git/polar-pond-amethyst|https://3921b1b6-3a0a-4d56-bd42-eef60c831385@api.glitch.com/git/resilient-same-pink|https://3921b1b6-3a0a-4d56-bd42-eef60c831385@api.glitch.com/git/octagonal-melodic-cornet|https://3921b1b6-3a0a-4d56-bd42-eef60c831385@api.glitch.com/git/ajar-frosted-carp|https://3921b1b6-3a0a-4d56-bd42-eef60c831385@api.glitch.com/git/encouraging-daily-rotate|https://3921b1b6-3a0a-4d56-bd42-eef60c831385@api.glitch.com/git/canyon-nutritious-sushi|https://3921b1b6-3a0a-4d56-bd42-eef60c831385@api.glitch.com/git/ambiguous-yummy-periwinkle|https://3921b1b6-3a0a-4d56-bd42-eef60c831385@api.glitch.com/git/thirsty-warp-way|https://3921b1b6-3a0a-4d56-bd42-eef60c831385@api.glitch.com/git/alive-chestnut-tumble`.trim().split('|');

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