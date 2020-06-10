const functions = require('firebase-functions');
const app = require('express')();
const FBAuth = require('./Util/FBAuth');
const cors = require('cors');
app.use(cors())
const { db } = require('./Util/admin')
const { 
    signup,
    login,
    updateUserData,
    getAuthenticatedUser,
    getUsers,
    deleteUser,
    likeUser,
    dislikeUser,
    getOneUser,
    uploadImage,
    uploadImageCollection,
    deleteImgInCollection,
    markNotificationsRead
} = require('./handlers/users');

exports.api = functions.region('asia-east2').https.onRequest(app);

// sign up
app.post('/signup', signup);
// login
app.post('/login', login);
//get user data
app.get('/user', FBAuth, getAuthenticatedUser);
// update user data
app.post('/user', FBAuth, updateUserData);
//upload image
app.post('/user/image', FBAuth, uploadImage);
//upload collection
app.post('/user/image-collection/upload', FBAuth, uploadImageCollection);
app.delete('/user/image-collection/delete/:imgName', FBAuth, deleteImgInCollection);
// get others user to match
app.get('/users', FBAuth, getUsers);
// get one user
app.get('/user/:userName', FBAuth, getOneUser)
// delete user
app.delete('/user', FBAuth, deleteUser)
// like user
app.get('/like/:userName', FBAuth, likeUser)
app.get('/dislike/:userName', FBAuth, dislikeUser)
app.post('/notifications', FBAuth, markNotificationsRead);

exports.createNotificationOnLike = functions.region('asia-east2').firestore.document('like/{likeId}')
    .onCreate(snapshot => {
        db.collection('like')
            .where('user', '==', snapshot.data().target)
            .where('target', '==', snapshot.data().user)
            .get()
            .then(data => {
                var newDate = new Date();
                newDate.setHours(newDate.getHours() + 7)
                if(data.empty){
                    return db.collection('notifications').add({
                        createdAt: newDate.toLocaleString(),
                        sender: snapshot.data().user,
                        recipient: snapshot.data().target,
                        body: `${snapshot.data().user} has liked you`,
                        type: 'liked',
                        read: false,
                        notificationId : snapshot.id
                    })
                } else {
                    return db.collection('notifications').add({
                        createdAt: newDate.toLocaleString(),
                        sender: snapshot.data().target,
                        recipient: snapshot.data().user,
                        body: `You and ${snapshot.data().target} are matched`,
                        type: 'matched',
                        read: false,
                        notificationId : snapshot.id
                    }).then(() => {
                        return db.collection('notifications').add({
                            createdAt: newDate.toLocaleString(),
                            sender: snapshot.data().user,
                            recipient: snapshot.data().target,
                            body: `You and ${snapshot.data().user} are matched`,
                            type: 'matched',
                            read: false,
                            notificationId : snapshot.id
                        })
                    })
                }
            })      
            .catch(err => {
                console.error(err);
                return;
            })  
    })
exports.deleteNotificationOnUnlike = functions.region('asia-east2').firestore.document('like/{likeId}')
    .onDelete(snapshot => {
        const notiOfSender = db.collection('notifications').where('sender', '==', snapshot.data().userName)
        const notiOfRecipient = db.collection('notifications').where('recipient', '==', snapshot.data().userName)
        notiOfSender
            .get()
            .then(data => {
                if(!data.empty){
                    for(const doc of data.docs) {
                        db.doc(`/notifications/${doc.id}`).delete()
                    }
                }
                return notiOfRecipient.get();
            })
            .then(data => {
                if(!data.empty){
                    for(const doc of data.docs) {
                        db.doc(`/notifications/${doc.id}`).delete()
                    }
                }
                return ;
            })
            .catch(err => {
                console.log(err);
                return;
            })
    })
exports.onDeleteUser = functions.region('asia-east2').firestore.document('users/{userName}')
    .onDelete(snapshot => {
        const likeDocOfUser = db.collection('like').where('user', '==', snapshot.data().userName)
        const likeDocOfTarget = db.collection('like').where('target', '==', snapshot.data().userName)
        const disLikeDocOfUser = db.collection('dislike').where('user', '==', snapshot.data().userName)
        const dislikeDocOfTarget = db.collection('dislike').where('target', '==', snapshot.data().userName)
        const notiOfSender = db.collection('notifications').where('sender', '==', snapshot.data().userName)
        const notiOfRecipient = db.collection('notifications').where('recipient', '==', snapshot.data().userName)
        likeDocOfUser
            .get()
            .then(data => {
                if(!data.empty){
                    for(const doc of data.docs) {
                        db.doc(`/like/${doc.id}`).delete()
                    }
                }
                return likeDocOfTarget.get()
            })
            .then(data => {
                if(!data.empty){
                    for(const doc of data.docs) {
                        db.doc(`/like/${doc.id}`).delete()
                    }
                }
                return disLikeDocOfUser.get()
            })
            .then(data => {
                if(!data.empty){
                    for(const doc of data.docs) {
                        db.doc(`/dislike/${doc.id}`).delete()
                    }
                }
                return dislikeDocOfTarget.get()
            })
            .then(data => {
                if(!data.empty){
                    for(const doc of data.docs) {
                        db.doc(`/dislike/${doc.id}`).delete()
                    }
                }
                return notiOfSender.get();
            })
            .then(data => {
                if(!data.empty){
                    for(const doc of data.docs) {
                        db.doc(`/notifications/${doc.id}`).delete()
                    }
                }
                return notiOfRecipient.get();
            })
            .then(data => {
                if(!data.empty){
                    for(const doc of data.docs) {
                        db.doc(`/notifications/${doc.id}`).delete()
                    }
                }
                return ;
            })
            .catch(err => {
                console.log(err);
                return;
            })
    })
