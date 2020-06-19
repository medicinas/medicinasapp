import * as React from 'react';
import {View, TextInput, ActivityIndicator, StyleSheet, Platform} from 'react-native';
import { Title, Button } from 'react-native-paper';
import {useTheme, ParamListBase, StackActions, Link, RouteProp, useLinkProps} from '@react-navigation/native';
import {
  createStackNavigator,
  HeaderBackButton,
  StackNavigationProp,
} from '@react-navigation/stack';

type AuthStackParams = {
  Splash: undefined;
  Home: undefined;
  SignIn: undefined;
  SignUp: undefined;
  PostSignOut: undefined;
};

type SimpleStackNavigation = StackNavigationProp<AuthStackParams>;

const AUTH_CONTEXT_ERROR =
  'Authentication context not found. Have your wrapped your components with AuthContext.Consumer?';
const LinkButton = ({
                        to,
                        ...rest
                    }: React.ComponentProps<typeof Button> & { to: string }) => {
    const { onPress, ...props } = useLinkProps({ to });

    return (
        <Button
            {...props}
            {...rest}
            {...Platform.select({
                web: { onClick: onPress } as any,
                default: { onPress },
            })}
        />
    );
};

const AuthContext = React.createContext<{
  signIn: () => void;
  signUp: () => void;
  signOut: () => void;
}>({
  signIn: () => {
    throw new Error(AUTH_CONTEXT_ERROR);
  },
  signUp: () => {
    throw new Error(AUTH_CONTEXT_ERROR);
  },
  signOut: () => {
    throw new Error(AUTH_CONTEXT_ERROR);
  },
});

const SplashScreen = () => {
  return (
    <View style={styles.content}>
      <ActivityIndicator />
    </View>
  );
};

const SignInScreen = ({
                        navigation,
                        route
                      }: {
  navigation: SimpleStackNavigation;
  route: RouteProp<AuthStackParams, 'SignIn'>;
}) => {
  const { signIn } = React.useContext(AuthContext);
  const { colors } = useTheme();

  return (
    <View style={styles.content}>
      <TextInput
        placeholder="Username"
        style={[
          styles.input,
          { backgroundColor: colors.card, color: colors.text },
        ]}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={[
          styles.input,
          { backgroundColor: colors.card, color: colors.text },
        ]}
      />
      <Button mode="contained" onPress={signIn} style={styles.button}>
        Sign in
      </Button>

      <Link
          to="/auth-flow/sign-up"
          style={[styles.button, { padding: 8 }]}
      >
        No te has registrado? Crea una cuenta.
      </Link>
      <LinkButton
        to="/link-component/article/babel"
        mode="contained"
        style={styles.button}
      >
        No te has registrado? Crea una cuenta.
      </LinkButton>
    </View>
  );
};

const SignUpScreen = ({
                        navigation
                      }: {
  navigation: SimpleStackNavigation;
}) => {
  const { signUp } = React.useContext(AuthContext);
  const { colors } = useTheme();

  return (
    <View style={styles.content}>
      <TextInput
        placeholder="Username"
        style={[
          styles.input,
          { backgroundColor: colors.card, color: colors.text },
        ]}
      />
      <TextInput
        placeholder="Email"
        style={[
          styles.input,
          { backgroundColor: colors.card, color: colors.text },
        ]}
      />
      <TextInput
        placeholder="Id number"
        style={[
          styles.input,
          { backgroundColor: colors.card, color: colors.text },
        ]}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={[
          styles.input,
          { backgroundColor: colors.card, color: colors.text },
        ]}
      />

      <TextInput
          placeholder="Confirm password"
          style={[
            styles.input,
            { backgroundColor: colors.card, color: colors.text },
          ]}
      />
      <Button mode="contained" onPress={signUp} style={styles.button}>
        Sign up
      </Button>
    </View>
  );
};

const HomeScreen = () => {
  const { signOut } = React.useContext(AuthContext);

  return (
    <View style={styles.content}>
      <Title style={styles.text}>Signed in successfully 🎉</Title>
      <Button onPress={signOut} style={styles.button}>
        Sign out
      </Button>
    </View>
  );
};

const SimpleStack = createStackNavigator<AuthStackParams>();

type Props = Partial<React.ComponentProps<typeof SimpleStack.Navigator>> & {
  navigation: StackNavigationProp<ParamListBase>;
};

type State = {
  isLoading: boolean;
  isSignout: boolean;
  userToken: undefined | string;
};

type Action =
  | { type: 'RESTORE_TOKEN'; token: undefined | string }
  | { type: 'SIGN_IN'; token: string }
  | { type: 'SIGN_UP'}
  | { type: 'SIGN_OUT' };

export default function SimpleStackScreen({ navigation , ...rest }: Props) {
  const [state, dispatch] = React.useReducer<React.Reducer<State, Action>>(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
          case 'SIGN_UP':
          return {
              ...prevState,
            isSignout:true,
            userToken: undefined};
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: undefined,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: undefined,
    }
  );

  React.useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: 'RESTORE_TOKEN', token: undefined });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  navigation.setOptions({
    headerShown: false,
  });

  const authContext = React.useMemo(
    () => ({
      signIn: () => dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' }),
      signUp: () => dispatch({type: 'SIGN_UP'}),
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <SimpleStack.Navigator {...rest}>
        {state.isLoading ? (
          <SimpleStack.Screen
            name="Splash"
            component={SplashScreen}
            options={{ title: 'Auth Flow' }}
          />
        ) : state.userToken === undefined ? (
            <>

          <SimpleStack.Screen
          name="SignIn"
          options={{
              title: 'Sign in',
              animationTypeForReplace: state.isSignout ? 'pop' : 'push',
            }}
            component={SignInScreen}
          />
            <SimpleStack.Screen
                name="SignUp"
                options={{
                  title: 'Sign up',
                  animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                }}
                component={SignUpScreen}
            />
            </>
        ) : (
          <SimpleStack.Screen
            name="Home"
            options={{ title: 'Home' }}
            component={HomeScreen}
          />
        )}
      </SimpleStack.Navigator>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  input: {
    margin: 8,
    padding: 10,
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  button: {
    margin: 8,
  },
  text: {
    textAlign: 'center',
    margin: 8,
  },
});
