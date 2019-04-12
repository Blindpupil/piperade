import { get } from 'lodash-es'

export default function createUser(data) {
  const { email } = data
  const { id } = data
  const { locale } = data
  const { name } = data

  const givenName = data.given_name
    ? data.given_name
    : data.first_name

  const familyName = data.family_name
    ? data.family_name
    : data.last_name

  let picture
  if (get(data, 'picture.data.url')) {
    // Comes from Facebook
    picture = get(data, 'picture.data.url')
  } else if (data.picture) {
    // Comes from google
    // eslint-disable-next-line
    picture = data.picture
  } else {
    // No picture
    picture = null
  }

  return {
    email,
    familyName,
    givenName,
    id,
    locale,
    name,
    picture,
    ingredientsList: []
  }
}

// FB-READY USER OBJECT EXAMPLE
// Collections
// {
//   pantry,
//   lists,
//   recipes
// }
// Fields
// {
//   email: "cesar@gmail.com",
//   family_name: "Martinez",
//   given_name: "Cesar",
//   id: "113976752210995750859",
//   locale: "en",
//   name: "Cesar Martinez",
//   picture: "https://lh4.googleusercontent.com/-gBnq_iPibFY/...",
//   verified_email: true,
//   ingredientsList: ['garlic', 'onion']
// }
