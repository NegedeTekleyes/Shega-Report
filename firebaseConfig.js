import {intializeApp} from 'firebase/app'
import {getStorage} from 'firebase/storage'

const firebaseConfig ={
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",

}
const app = intializeApp(firebaseConfig)
export const storage = getStorage(app)