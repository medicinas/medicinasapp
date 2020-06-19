import HomeScreen from "../screens/HomeScreen";
import TabBarIcon from "../components/TabBarIcon";
import LinksScreen from "../screens/LinksScreen";
import StackNavigator from "@react-navigation/stack/src/navigators/createStackNavigator";
import React from "react";

const INITIAL_ROUTE_NAME = 'SignIn';

export default function AuthFlow({navigation, route}) {

	navigation.setOptions({headerTitle: getHeaderTitle(route)});

	return (
		<StackNavigator.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
			<StackNavigator.Screen
				name="Home"
				component={HomeScreen}
				options={{
					title: 'Get Started',
					tabBarIcon: ({focused}) => <TabBarIcon focused={focused} name="md-code-working"/>,
				}}
			/>
			<StackNavigator.Screen
				name="Links"
				component={LinksScreen}
				options={{
					title: 'Resources',
					tabBarIcon: ({focused}) => <TabBarIcon focused={focused} name="md-book"/>,
				}}
			/>
		</StackNavigator.Navigator>
	);
}

function getHeaderTitle(route) {
	const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

	switch (routeName) {
		case 'Home':
			return 'How to get started';
		case 'Links':
			return 'Links to learn more';
	}
}
