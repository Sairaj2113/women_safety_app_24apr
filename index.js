const player = require('play-sound')();
const express = require('express');
const twilio = require('twilio');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Twilio credentials
const accountSid = 'ACfb783483086419eab68ef4714ee64659';
const authToken = '920f4edbd1ac1dfc7f9b4d3336d32546';
const client = new twilio(accountSid, authToken);




// Endpoint to send SMS
app.post('/send-sms', (req, res) => {
  const {to, body} = req.body;
 client.messages
    .create({
		body: body,
                from: '+13605268250',
        to: to
    })
    .then(message => console.log(message.sid))
    .catch(err => console.log(err))
client.calls.create({
        twiml: `<Response><Say>Your friend is in danger check message for location</Say></Response>`,
        to: to ,
        from: '+13605268250'
    })
    .then(call => console.log(`Call initiated with SID: ${call.sid}`))
    .catch(error => console.error(`Error making call: ${error.message}`))

});


let groups = [
  { id: 1, name: 'Group 1', members: ['user1', 'user2'], messages: [] },
  { id: 2, name: 'Group 2', members: ['user1', 'user3'], messages: [] }
];

app.get('/api/groups', (req, res) => {
  res.json(groups);
});

// Get messages for a specific group
app.get('/api/groups/:groupId/messages', (req, res) => {
  const groupId = parseInt(req.params.groupId);
  const group = groups.find(group => group.id === groupId);
  if (!group) {
    return res.status(404).json({ error: 'Group not found' });
  }
  res.json(group.messages);
});

app.post('/api/groups/:groupId/messages', (req, res) => {
  const groupId = parseInt(req.params.groupId);
  const group = groups.find(group => group.id === groupId);
  if (!group) {
    return res.status(404).json({ error: 'Group not found' });
  }
  const { text } = req.body;
  const newMessage = { id: group.messages.length + 1, sender: 'user1', text };
  group.messages.push(newMessage);
  res.json(newMessage);
});



app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
