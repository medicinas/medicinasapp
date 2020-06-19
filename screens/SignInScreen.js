import { View, TextInput, ActivityIndicator, StyleSheet } from 'react-native';
import React from "react";
import AuthContext from "../utils/AuthContext";
import { useTheme, ParamListBase } from '@react-navigation/native';
import { Button } from 'react-native-paper';

const SignInScreen = () => {
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
		</View>
	);
};

export default SignInScreen;
