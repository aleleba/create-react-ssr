const PRName = function () {
    let ID = "";
    // let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let characters = "0123456789";
    for ( var i = 0; i < 6; i++ ) {
        ID += characters.charAt(Math.floor(Math.random() * 10));
    }
    return 'PR-'+ID;
};
  
console.log(PRName())