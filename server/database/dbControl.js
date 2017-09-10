// 1. mongoose 모듈 가져오기
var mongoose = require('mongoose');

// 2. testDB

function DBcontrol() {
    var self = this;

    if (!(self instanceof DBcontrol)) return new DBcontrol();

    self.userSchema = mongoose.Schema({
        userID: 'string',
        userPW: 'string',
        userRole: 'string'
    });

    self.User = mongoose.model('Schema', userSchema);

}

DBcontrol.prototype.init = function () {
    var self = this;
    // 나중에 수정
    mongoose.connect('mongodb://localhost:27017/sns');
// 3. 연결된 testDB 사용
    self.db = mongoose.connection;
// 4. 연결 실패
    db.on('error', function () {
        console.log('Connection Failed!');
    });
// 5. 연결 성공
    db.once('open', function () {
        console.log('Connected!');
    });


};
// db에 있으면 true 없으면 false
DBcontrol.prototype.checkDB = function (id) {
    var self = this;

    self.User.find(function(error, user){

        if(error){
            console.log(error);
            return false;
        }

        if(user.userID === id) return true;
    });

    return false;
};

DBcontrol.prototype.addUser = function (id, pw, role) {
    var self = this;

    if (self.checkDB(id)) return;

    // 여기서 문제 될 수 있음
    var newUser = new self.User({ userID: id, userPW: pw, userRole: role});

    newUser.save(function (error, data) {
        if (error){
            console.log(error);
            return null;
        }
        else{
            console.log('Saved!');
            return newUser;
        }
    });

    return null;
};

DBcontrol.prototype.findUser = function (id) {
    var self = this;

    self.User.findOne({userID: id}, function (error, user) {

        if (error) {
            console.log(error);
            return null;
        } else {
            console.log(user);
            return user;
        }
    });

    return null;
};

DBcontrol.prototype.updateUser = function (id , modifiedUserData) {
    var self = this;

    // 12. 특정아이디 수정하기
    self.User.findOne({userID:id}, function(error,user){
        console.log('--- Update(PUT) ---');
        if(error){
            console.log(error);
            return false;
        }else{
            user.userPW = modifiedUserData.userPW;
            user.userRole = modifiedUserData.userRole;
            user.save(function(error,modified_student){
                if(error){
                    console.log(error);
                }else{
                    console.log(modified_student);
                    return true;
                }
            });
        }
    });

    return false;
};

DBcontrol.prototype.removeUser = function (id) {
    var self = this;

    self.User.remove({userID:id}, function(error,output){
        console.log('--- Delete ---');
        if(error){
            console.log(error);
        }

        /* ( SINCE DELETE OPERATION IS IDEMPOTENT, NO NEED TO SPECIFY )
            어떤 과정을 반복적으로 수행 하여도 결과가 동일하다. 삭제한 데이터를 다시 삭제하더라도, 존재하지 않는 데이터를 제거요청 하더라도 오류가 아니기 때문에
            이부분에 대한 처리는 필요없다. 그냥 삭제 된것으로 처리
            */
        console.log('--- deleted ---');
    });

};




