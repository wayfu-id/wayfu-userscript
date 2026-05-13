import * as React from "react";
import * as ReactDOM from "react-dom/client";

// Shim window so components that read it directly also work
window["React"] = React;
window["ReactDOM"] = ReactDOM;
