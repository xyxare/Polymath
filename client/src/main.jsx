import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import { UserProvider } from "./context/UserContext";
import "./config/axiosConfig";

ReactDOM.render(
	<React.StrictMode>
		<UserProvider>
			<App />
		</UserProvider>
	</React.StrictMode>,
	document.getElementById("root")
);
