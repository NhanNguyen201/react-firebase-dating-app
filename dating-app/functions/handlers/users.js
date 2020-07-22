const { db, admin } = require('../Util/admin');
const config = require('../Util/config');
const firebase = require('firebase');
firebase.initializeApp(config);

const { validateSignupData, validateLoginData, reduceUserData } = require('../Util/Validators');

exports.signup = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        userName: req.body.userName,
        gender: req.body.gender,
        seek: req.body.seek,
        role: req.body.role
    }
    const { valid, errors } = validateSignupData(newUser);
    if(!valid) return res.status(400).json(errors);
    let token, userId;
    db.doc(`/users/${newUser.hanlde}`).get()
        .then(doc => {
            if(doc.exists){
                return res.status(400).json({ userName: 'this user-name is already taken'})
            } else {
                return firebase
                            .auth()
                            .createUserWithEmailAndPassword(newUser.email, newUser.password)
            }
        })
        .then(data => {
            userId = data.user.uid;
            return data.user.getIdToken()            
        })
        .then(idToken => {
            token = idToken;
            const userCredential = {
                userName: newUser.userName,
                email: newUser.email,
                imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${newUser.gender}.png?alt=media`,
                gender: newUser.gender,
                seek: newUser.seek,
                userId,
                role: newUser.role
            };
            db.doc(`/users/${newUser.userName}`).set(userCredential);
        })
        .then (() => {
            return res.status(201).json({token});
        })
        .catch(err => {
            console.error(err);
            if (err.code === 'auth/email-already-in-use'){
                return res.status(400).json({email: 'Email is already in use'})
            } else {
                return res.status(500).json({general: 'something is wrong, please try again'})
            }            
        })
}

exports.login =  (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    }
    const { valid, errors } = validateLoginData(user);
    if(!valid) return res.status(400).json(errors);

    firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then((data) => {
            return data.user.getIdToken();
        })
        .then((token) => {
            return res.json({token})
        })
        .catch(err => {
            console.error(err);
            return res.status(403).json({general: "Wrong credential, please try again"})
        })
}

exports.updateUserData = (req, res) => {
    let userData = reduceUserData(req.body);
    db.doc(`/users/${req.user.userName}`).update(userData)
        .then(() => {
            return res.json({message: "update user data successfully"})
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({error: err.code})
        })
}

exports.getUsers = (req, res) => {
    var peopleList = [];
    const likeDocOfTheUser = db.collection('like').where('user', '==', req.user.userName);
    const disLikeDocOfTheUser = db.collection('dislike').where('user', '==', req.user.userName);
    db.collection('users')
        .get()
        .then(data => {
            data.forEach(doc => {
                if( doc.data().gender == req.user.seek 
                    && doc.data().seek == req.user.gender
                    && doc.data().role == req.user.role
                    && doc.data().userName !== req.user.userName
                ){
                    peopleList.push(doc.data())
                }
            })
            return likeDocOfTheUser.get()
        })
        .then(data => {
            if(!data.empty){
                for(const doc of data.docs){
                   peopleList = peopleList.filter(eachPeople => eachPeople.userName !== doc.data().target) 
                }
            }
            return disLikeDocOfTheUser.get()
        })
        .then(data => {
            if(!data.empty){
                for (const doc of data.docs) {
                    peopleList = peopleList.filter(eachPeople => eachPeople.userName !== doc.data().target)
                }
            }
            return res.json(peopleList)
        })
        .catch(err => console.error(err))
}

exports.getOneUser = (req, res)=> {
    const likeDoc = 
        db
        .collection('like')
        .where('user', '==', req.user.userName)
        .where('target', '==', req.params.userName)
        .limit(1);
    const dislikeDoc = 
        db
        .collection('dislike')
        .where('user', '==', req.user.userName)
        .where('target', '==', req.params.userName)
        .limit(1);
    var userData;
    db.doc(`/users/${req.params.userName}`)
        .get()
        .then(doc => {
            if(!doc.exists){
                return res.status(404).json({error: "user not found"})
            } else {
                userData = doc.data();
                return likeDoc.get()
            }
        })
        .then(data => {
            if(!data.empty) userData.isLiked = true;
            return dislikeDoc.get()
        })
        .then(data => {
            if(!data.empty) userData.isDisliked = true;
            return res.json(userData)
        })
        .catch(err => console.error(err))
}

exports.getAuthenticatedUser = (req, res) => {
    let userData = {};
    db.doc(`/users/${req.user.userName}`).get()
        .then(doc => {
            if(doc.exists){
                userData.credentials = doc.data();
                return db.collection('notifications')
                    .where('recipient', '==', req.user.userName)
                    .orderBy('createdAt','desc')
                    .limit(10)
                    .get()
            }
        })
        .then(data => {
            userData.notifications = [];
            data.forEach(doc => {
                userData.notifications.push({
                    recipient: doc.data().recipient,
                    sender: doc.data().sender,
                    createdAt: doc.data().createdAt,
                    body: doc.data().body,
                    type: doc.data().type,
                    read: doc.data().read,
                    notification: doc.id
                })
            })
            return res.json(userData)
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({error: err})
        })
}

exports.deleteUser = (req, res) => {
    const document = db.doc(`/users/${req.user.userName}`);
    var user = firebase.auth().currentUser;
    user.delete()
        .then(() =>  {
            document
                .get()
                .then(doc => {
                    if(!doc.exists){
                        return res.status(404).json({error: 'user not found'})
                    } else {
                        return document.delete()
                    }
                })
                .then(() => {
                    res.json({message: 'delete user successfully'})
                })
                .catch(err => {
                    console.error(err);
                    return res.status(500).json({error: err.code})
                })
        })
        .catch(err => console.error(err)); 
}

exports.likeUser = (req, res) => {
    if(req.user.userName == req.params.userName) return res.status(400).json({error: "Cannot like yourself"});
    const likeDoc = 
        db
        .collection('like')
        .where('user', '==', req.user.userName)
        .where('target', '==', req.params.userName)
        .limit(1);
    const dislikeDoc = 
        db
        .collection('dislike')
        .where('user', '==', req.user.userName)
        .where('target', '==', req.params.userName)
        .limit(1);
    const likeProfile = db.doc(`/users/${req.params.userName}`)

    likeProfile
        .get()
        .then(doc => {
            if (!doc.exists){
                return res.json(404).json({error: "user not found"})
            } else {
                return likeDoc.get()
            }
        })
        .then(data => {
            if(data.empty){
                return db.collection('like').add({
                    user: req.user.userName,
                    target: req.params.userName
                })
                .then(() => {
                    return dislikeDoc.get()
                })
            } else {
                return res.status(400).json({error: "already like this people"})
            } 
        })
        .then(data => {
            if(!data.empty){
                db.doc(`/dislike/${data.docs[0].id}`).delete()
            } 
            return res.status(200).json({message: "like successful"})
        })
        .catch(err => console.error(err))
}

exports.dislikeUser = (req, res) => {
    if(req.user.userName == req.params.userName) return res.status(400).json({error: "Cannot dislike yourself"});
    const likeDoc = db
        .collection('like')
        .where('user', '==', req.user.userName)
        .where('target', '==', req.params.userName)
        .limit(1);
    const dislikeDoc = db
        .collection('dislike')
        .where('user', '==', req.user.userName)
        .where('target', '==', req.params.userName)
        .limit(1);
    const dislikeProfile = db.doc(`/users/${req.params.userName}`)

    dislikeProfile
        .get()
        .then(doc => {
            if (!doc.exists){
                return res.json(404).json({error: "user not found"})
            } else {
                return dislikeDoc.get()
            }
        })
        .then(data => {
            if(data.empty){
                return db.collection('dislike').add({
                    user: req.user.userName,
                    target: req.params.userName
                })
                .then(() => {
                    return likeDoc.get()
                })
            } else {
                return res.status(400).json({error: "already dislike this people"})
            } 
        })
        .then(data => {
            if(!data.empty){
                db.doc(`/like/${data.docs[0].id}`).delete()
            } 
            return res.status(200).json({message: "dislike successful"})
        })
        .catch(err => console.error(err))
}

exports.uploadImage = (req, res) => {
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');
    let imageFileName;
    let imageToBeUploaded = {};
    const busboy = new BusBoy({headers: req.headers});
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if(mimetype !== 'image/jpeg' && mimetype !== 'image/png'){
            return res.status(400).json({error: 'wrong file type submited'})
        }
        const imageExtension = filename.split('.')[filename.split('.').length - 1];
        imageFileName = `${Math.round(Math.random() * 1000000)}.${imageExtension}`;
        const filepath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = {filepath, mimetype};
        file.pipe(fs.createWriteStream(filepath));
    })
    busboy.on('finish', () => {
        admin.storage().bucket().upload(imageToBeUploaded.filepath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimetype
                }
            }
        })
        .then(() => {
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
            return db.doc(`/users/${req.user.userName}`).update({imageUrl})
        })
        .then(() => {
            return res.json({message: 'Image upload successfully'})
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({error: err})
        })
    });
    busboy.end(req.rawBody);
}

exports.uploadImageCollection = (req, res) => {
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');
    let imageFileName;
    let imageToBeUploaded = {};
    const busboy = new BusBoy({headers: req.headers});
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if(mimetype !== 'image/jpeg' && mimetype !== 'image/png'){
            return res.status(400).json({error: 'wrong file type submited'})
        }
        const imageExtension = filename.split('.')[filename.split('.').length - 1];
        imageFileName = `${Math.round(Math.random() * 100000000)}.${imageExtension}`;
        const filepath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = {filepath, mimetype};
        file.pipe(fs.createWriteStream(filepath));
    })
    busboy.on('finish', () => {
        admin.storage().bucket().upload(imageToBeUploaded.filepath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimetype
                }
            }
        })
        .then(() => {
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
            db.doc(`/users/${req.user.userName}`)
                .get()
                .then(doc => {
                    if(doc.exists){
                        var collection = doc.data().imageCollection;
                        if(!collection){
                            collection = []
                        }
                        collection.push(imageUrl);
                        return db.doc(`/users/${req.user.userName}`).update({imageCollection: collection})
                    } else {
                        return res.status(400).json({error: 'user not found'})
                    }
                })
        })
        .then(() => {
            return res.json({message: 'Image upload successfully'})
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({error: err})
        })
    });
    busboy.end(req.rawBody);
}

exports.deleteImgInCollection = (req, res) => {
    const imageName = req.params.imgName;
    const imageSrc = `https://firebasestorage.googleapis.com/v0/b/dating-76c25.appspot.com/o/${imageName}?alt=media`
    
    db.doc(`/users/${req.user.userName}`)
        .get()
        .then(doc => {
            if(doc.exists){
                var collection = doc.data().imageCollection;
                if(collection && collection.length > 0){
                    var newCollection = collection.filter(item => item !== imageSrc)
                    return db.doc(`/users/${req.user.userName}`)
                        .update({imageCollection: newCollection})                    
                } else {
                    return db.doc(`/users/${req.user.userName}`)
                            .update({imageCollection: []})
                }
            } else {
                return res.status(400).json({error: 'user not found'})
            }
        })
        .then(() => {
            return admin.storage().bucket().file(imageName).delete()
                .then(() => {
                    return res.json({message: "delete image successfully"})
                })
                .catch(err => {
                    return res.status(404).json({error: 'image is not in the storage'})
                })
        })
        .then(() => {
            return res.json({message: "delete image successfully"})
        })
        .catch(err => {
            console.error(err.code)
        })
}

exports.markNotificationsRead = (req, res) => {
    let batch = db.batch();
    req.body.forEach(notificationId => {
        const notification = db.doc(`/notifications/${notificationId}`);
        batch.update(notification, {read: true})
    });
    batch.commit()
        .then(() => {
            return res.json({message: 'notifications marked read'})
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({error: err.code})
        })
}