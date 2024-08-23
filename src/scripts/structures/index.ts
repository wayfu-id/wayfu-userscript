// Import the default classes
import BaseModel from "./BaseModel";
import Client from "./Client";
import Message from "./Message";
import MyArray from "./MyArray";
import MyDate from "./MyDate";
import ScriptManager from "./ScriptManager";
import Settings from "./Settings";

// Import the default classes
import Queue from "./Queue";
import Worker from "./Worker";

// Create Object(s) from classes
const Jobs = new Queue();
const Loop = new Worker();

export {
    // Exports the default classes
    BaseModel,
    Client,
    Message,
    MyArray,
    MyDate,
    Queue,
    ScriptManager,
    Settings,
    // Exports the Object(s) from classes
    Jobs,
    Loop,
}