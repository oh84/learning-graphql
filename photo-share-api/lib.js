const requestGithubToken = (credentials) => {
  return fetch(
    'https://github.com/login/oauth/access_token',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(credentials)
    }
  )
    .then(res => {
      return res.json()
    })
    .catch(error => {
      throw new Error(JSON.stringify(error))
    })
}

const requestGithubUserAccount = (token) => {
  return fetch(
    'https://api.github.com/user',
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      }
    }
  )
    .then(res => res.json())
    .catch(error => {
      throw new Error(JSON.stringify(error))
    })
}

const authorizeWithGithub = async (credentials) => {
  const result = await requestGithubToken(credentials)
  const { access_token } = result
  const githubUser = await requestGithubUserAccount(access_token)
  return { ...githubUser, access_token }
}

module.exports = { authorizeWithGithub }
