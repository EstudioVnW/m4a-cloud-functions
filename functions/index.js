const functions = require('firebase-functions');

const admin = require('firebase-admin');

admin.initializeApp();

exports.createMessage = functions.firestore.document('chat/{groupId}/messages/{messageId}')
  .onCreate((snap, context) => {
    const data = snap.data()
    console.log(data)

    const grupoId = context.params.groupId;
    const payload = {
      topic: `chatgroup_${grupoId}`,
      data: {
        sender: `${data.user._id}`,
        group: `${grupoId}`,
        title: `Match4Action - ${data.groupName}`,
        body: data.text,
      },
      notification: {
        title: `Match4Action - ${data.groupName}`,
        body: `${data.user.name}: ${data.text}`
      },
      apns: {
        headers: {
          'apns-priority': '5',
          'apns-push-type': 'background',
          'content-available': 'true',
        },
      }
    }

    admin.messaging().send(payload)
      .then(res => console.log(res))
      .catch(error => console.log(error))
    return true
  });