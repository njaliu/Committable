import firebase from 'firebase'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBzGwcfmI8KIPqYrno50L55lA3lhNs0BOc',
  authDomain: 'newproject-d3f5f.firebaseapp.com',
  projectId: 'newproject-d3f5f',
  storageBucket: 'newproject-d3f5f.appspot.com',
  messagingSenderId: '469719711963',
  appId: '1:469719711963:web:473a85dbf3400103c44cfe',
  measurementId: 'G-4GSBQM96M3',
}

firebase.initializeApp(firebaseConfig)
firebase.analytics()

export default firebase
