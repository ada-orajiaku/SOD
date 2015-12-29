var WebSqlAdapter = function () {
	var db;
	//var host = 'http://localhost:8888/dunamis/api';
	var host = 'http://www.dunamisgospel.org/api';
	monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
	//dayNames = [ "1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th","11th","12th","13th","14th","15th","16th","17th","18th","19th","20th","21st","22nd","23rd","24th","25th","26th","27th","28th","29th","30th","31st" ];

    this.initialize = function () {
        var deferred = $.Deferred();
        db = window.openDatabase("SOD", "1.0", "SOD", 6000000);
        db.transaction(
            function (tx) {
                createTable(tx);
                checkMonth(tx);
            },
            function (error) {
                console.log('Transaction error: ' + error);
                deferred.reject('Transaction error: ' + error);
            },
            function () {
                console.log('Transaction success');
                deferred.resolve();
            }
        );
        return deferred.promise();
    }

    var createTable = function (tx) {
    	//tx.executeSql('DROP TABLE IF EXISTS sod'); tx.executeSql('DROP TABLE IF EXISTS page');
        var s = "CREATE TABLE IF NOT EXISTS sod(ID INTEGER PRIMARY KEY, remoteid UNIQUE,day,month,title,scripture,thought,body,assignment,prayer,declaration,further,daily)";
        var b = "CREATE TABLE IF NOT EXISTS bookmark(ID INTEGER PRIMARY KEY, remoteid UNIQUE,day,month,title,scripture,thought,body,assignment,prayer,declaration,further,daily)";

        tx.executeSql(s, null, function () { console.log('Create Sod table success'); },errorCB);
        tx.executeSql(b, null, function () { console.log('Create Bookmark table success'); }, errorCB);
    }

    var checkMonth = function (tx){
    	var today = new Date();
    	var sql= "SELECT * FROM sod s LIMIT 1";
        tx.executeSql(sql,null, function (tx, s) {
            if(s.rows.length > 0){
            	if(s.rows.item(0).month != (today.getMonth()+1)){
            		console.log("You have the wrong month. YOU NEED TO GET SOD FOR NEW MONTH");
            		var s = "CREATE TABLE IF NOT EXISTS sod(ID INTEGER PRIMARY KEY, remoteid UNIQUE,day,month,title,scripture,thought,body,assignment,prayer,declaration,further,daily)";
            		tx.executeSql('DROP TABLE IF EXISTS sod');
                    tx.executeSql(s, null, function () { console.log('Create Sod table success'); },errorCB);
            		sod.fetch();
            	}else{
            		console.log("You have the current month");
            	}
            }else{
            	console.log("apparently there are no months in the database");
            }
        },errorCB);

    	window.localStorage.month = today.getMonth()+1;
    	window.localStorage.year = today.getFullYear();
    }

    function errorCB(err){
		 console.log("ERROR PROCESSING SQL: "+err.message + "\nCODE="+err.code);
	}


    //SOD Functions
    sod = {
    	refresh: function(){
    		var self = this;
        	db.transaction(
                function (tx) {
                	var s = "CREATE TABLE IF NOT EXISTS sod(ID INTEGER PRIMARY KEY, remoteid UNIQUE,day,month,title,scripture,thought,body,assignment,prayer,declaration,further,daily)";
                	tx.executeSql('DROP TABLE IF EXISTS sod', null, function (tx) {console.log('DELETE sod table success');$('#thelist').html("Getting Seeds Of Destiny content....")
                		tx.executeSql(s, null, function () {console.log('CREATE sod table success');
                			self.fetch();
                		}, errorCB);
                	}, errorCB);
                }
             )
    	},

    	fetch: function(){
			var self = this;
    		var url = host+"/fetchSod.php?month="+window.localStorage.month+"&year="+window.localStorage.year;
    		return $.ajax({url: url,dataType:'json', success: function(s){ console.log("FETCH SOD SUCCESS");self.save(s);new HomeView(adapter,homeTpl,sodLiTpl).render().el;} });
		},

		load: function(){
		    var deferred = $.Deferred();
		    var self = this;
        	db.transaction(
            	function (tx) {
               	 	var sql= "SELECT * FROM sod";
               	 	tx.executeSql(sql, null, function (tx, results) {
               	 		if(results.rows.length > 0){
                   	 		var sods = [];
                   	 		for (i=0;i < results.rows.length; i++) {
                   	 			sods[i] = results.rows.item(i);
                   	 		}
                   	 		deferred.resolve(sods);
               	 		}else{ deferred.resolve(self.fetch());}
               	 	});
            	}, errorCB);
        	return deferred.promise();
		},

		read: function(remoteid){
		    var deferred = $.Deferred();
        	db.transaction(
            	function (tx) {
            		var sql = "SELECT * FROM sod s WHERE s.remoteid='"+remoteid+"' LIMIT 1";
                	tx.executeSql(sql,null, function (tx, results) {
                			deferred.resolve(results.rows.item(0));
                	});
            	},errorCB);
        	return deferred.promise();
		},

		save: function (sods) {
        	db.transaction(function(tx) {
       			var sql = "INSERT INTO sod (remoteid,day,month,title,scripture,thought,body,assignment,prayer,declaration,further,daily) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
       			$.each(sods,function(i) {
       				s = sods[i];
       				tx.executeSql(sql, [s.remoteid,s.day,s.month,s.title,s.scripture,s.thought,s.body,s.assignment,s.prayer,s.declaration,s.further,s.daily],
       					function () { console.log('INSERT sod success'); },errorCB);
       			});
        	});

        },

		addBookmark: function (remoteid) {
        	db.transaction(function(tx) {
        		var sql = "SELECT * FROM sod s WHERE s.remoteid='"+remoteid+"' LIMIT 1";
            	tx.executeSql(sql,null, function (tx, results) {
            		s = results.rows.item(0);
            		var sql = "INSERT INTO bookmark (remoteid,day,month,title,scripture,thought,body,assignment,prayer,declaration,further,daily) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
           				tx.executeSql(sql, [s.remoteid,s.day,s.month,s.title,s.scripture,s.thought,s.body,s.assignment,s.prayer,s.declaration,s.further,s.daily],
           					function () { console.log('CREATE BOOKMARK success'); alert('Bookmark Created!');},errorCB);
            	});
        	});
        },

		removeBookmark: function(remoteid){
        	db.transaction(
            	function (tx) {
            		var sql = "DELETE * FROM bookmark b WHERE b.remoteid='"+remoteid+"' LIMIT 1";
                	tx.executeSql(sql,null, function () {console.log('REMOVE BOOKMARK success'); alert('Bookmark has been removed!')});
            	},errorCB);
		},

    };


    $.ajaxSetup({
    	beforeSend:function(){
    		$(".beforeLoader").hide();
    		$(".ajaxLoader").show();
    	},
    	complete:function(){
    		$(".beforeLoader").show();
    		$(".ajaxLoader").hide();
    	}
    });


}
