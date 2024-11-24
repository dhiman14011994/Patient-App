import auth from '@react-native-firebase/auth';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

// ********************************* GOOGLE LOGIN ******************************
export const googleConfiguration = () => {
  GoogleSignin.configure({
    offlineAccess: true,
    webClientId:
      '265155772290-n6g587fo4gdfc134qqq4d51m3t1l8o4l.apps.googleusercontent.com',
    iosClientId:
      '265155772290-rjcor7qetbceg818o9394jdi110dod41.apps.googleusercontent.com',
  });
};

export const googleLogin = async (callback: any) => {
  // If user already login with then first logout the user.
  await GoogleSignin.signOut();

  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(
      userInfo?.idToken,
    );

    const firebaseToken = await getUserAccessToken(googleCredential);
    console.log('userInfo', userInfo?.user?.email);
    console.log('firebaseToken', firebaseToken);

    callback({
      firebase_token: firebaseToken,
      social_type: 'google',
      email: userInfo?.user?.email,
    });
  } catch (error: any) {
    console.log('google error', error);
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log('google error SIGN_IN_CANCELLED', JSON.stringify(error));
      //reject(error);
      // user cancelled the login flow
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.log('google error IN_PROGRESS', JSON.stringify(error));
      // reject(error);
      // operation (e.g. sign in) is in progress already
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      console.log(
        'google error PLAY_SERVICES_NOT_AVAILABLE',
        JSON.stringify(error),
      );
      // reject(error);
      // play services not available or outdated
    } else {
      console.log('google error', JSON.stringify(error));
      // reject(error);
      // some other error happened
    }
  }
};
// ********************************* APPLE LOGIN ******************************

export const appleLogin = async (callback: any) => {
  const appleAuthRequestResponse = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.EMAIL],
  });

  // Ensure Apple returned a user identityToken
  if (!appleAuthRequestResponse.identityToken) {
    throw new Error('Apple Sign-In failed - no identify token returned');
  }

  // Create a Firebase credential from the response
  const {identityToken, nonce} = appleAuthRequestResponse;

  const appleCredential = auth.AppleAuthProvider.credential(
    identityToken,
    nonce,
  );

  const firebaseToken = await getUserAccessToken(appleCredential);
  const email = auth().currentUser?.email;
  callback(firebaseToken);
  // Sign the user in with the credential
};

export const revokeSignInWithAppleToken = async () => {
  // Get an authorizationCode from Apple
  const {authorizationCode} = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.REFRESH,
  });

  // Ensure Apple returned an authorizationCode
  if (!authorizationCode) {
    throw new Error('Apple Revocation failed - no authorizationCode returned');
  }

  // Revoke the token
  return auth().revokeToken(authorizationCode);
};

const getUserAccessToken = (credential: any) => {
  return new Promise((resolve, reject) => {
    auth()
      .signInWithCredential(credential)
      .then((_: any) => {
        auth()
          .currentUser?.getIdToken()
          .then((token: any) => resolve(token))
          .catch((error: any) => reject(error));
      })
      .catch((error: any) => reject(error));
  });
};
