import firebase from 'firebase/app';
import 'firebase/auth';

export const auth = firebase.initializeApp({
   //Enter your firebase app configs here
  }).auth();