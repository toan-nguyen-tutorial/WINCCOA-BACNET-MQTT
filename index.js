const express = require('express');
const mqtt = require('mqtt');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();

// socketio
const server = http.createServer(app);
const io = socketIo(server);

// MQTT 
const mqttClient = mqtt.connect('mqtt://192.168.102.248:1883');
let presentValue = 0;

// Subscribe topic
mqttClient.on('connect', () => {
    console.log('Connected to MQTT Broker');
    mqttClient.subscribe('MQTTBACnet/TemperatureIndoor', (err) => {
        if (err) {
            console.error('Failed to subscribe:', err);
        }
    });
    mqttClient.subscribe('MQTTBACnet/TemperatureOutdoor', (err) => {
        if (err) {
            console.error('Failed to subscribe:', err);
        }
    });
    mqttClient.subscribe('MQTTBACnet/TemperatureWater', (err) => {
        if (err) {
            console.error('Failed to subscribe:', err);
        }
    });

});

// Fetch data form topic
mqttClient.on('message', (topic, message) => {
    const data = JSON.parse(message.toString());
    if (data.Present_Value !== undefined) {
        const presentValue = data.Present_Value; // Lấy giá trị Present_Value
        const objectIdentify = data.Object_Identify; // Lấy giá trị Object_Identify
        const objectName = data.Object_Name; // Lấy giá trị Object_Name
        if (topic === 'MQTTBACnet/TemperatureIndoor') {
            io.emit('dataUpdate', { presentValue, objectIdentify, objectName });
        } else if (topic === 'MQTTBACnet/TemperatureOutdoor') {
            io.emit('dataUpdateSetpoint2', { presentValue, objectIdentify, objectName });
        } else if (topic === 'MQTTBACnet/TemperatureWater') {
            io.emit('dataUpdateSetpoint3', { presentValue, objectIdentify, objectName });
        }
    }
});





//socket for sendtoMQTT
io.on('connection', (socket) => {
    // console.log('A client connected');
    socket.on('sendToMQTT', ({ topic, message }) => {
    // console.log(`Publishing message "${message}" to topic "${topic}"`);
    mqttClient.publish(topic, message);
    
    // Gửi phản hồi về client sau khi gửi thành công
    socket.emit('message', `Sent message "${message}" to topic "${topic}"`);
  });

  // Khi client ngắt kết nối
  socket.on('disconnect', () => {
    // console.log('A client disconnected');
  });
});


// ========================================= SETPOINT==========================================================================
io.on('connection', (socket) => {

    // Nhận dữ liệu setpoint từ client
    socket.on('setpointData', (data) => {
        console.log(`Received setpoint data: ${JSON.stringify(data)}`);

        // Gửi giá trị nhận được tới các topic MQTT tương ứng
        mqttClient.publish(data.topic, data.value.toString(), (err) => {
            if (err) {
                console.error(`Failed to publish to ${data.topic}: ${err}`);
            } else {
                console.log(`Published value ${data.value} to ${data.topic}`);
            }
        });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// ===================================================================================================================


// Supply file HTML
app.use(express.static(path.join(__dirname, 'public')));

// Open Server
const PORT = process.env.PORT || 3400;
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

