Meteor.startup(function(){
  Meteor.subscribe("futuretrips");
});


 var places=[{title: "Vasco Da Gama",key: "vasco"},
              {title: "Panjim", key: "panjim"},
              {title: "Airport", key: "air"},
              {title: "Bogmallo Beach", key: "bog"},
              {title: "Majorda Beach", key: "maj"},
              {title: "Inox", key: "inox"}
             ];
Session.set("home", undefined);
Session.set("placename", undefined);
Session.set("formcheck", undefined);
Session.set("saved", undefined);
Session.set("editing",undefined);
Session.set("password",undefined);
Session.set("error",undefined);
Session.set("editor",undefined);
Session.set("c",undefined);
Session.set("cancelled", undefined);

Template.main.helpers({

    disp: function(){
        return Session.get("placename");
    },
    form: function(){
        return Session.get("formcheck");
    },
    savedform: function(){
        return Session.get("saved");
    },
    editform: function(){
        return Session.get("editing");
    },
    cancelled: function(){
      return Session.get("cancelled");
    }

});

Template.main.events({
    'click #home': function(){
      Session.set("placename", undefined);
      Session.set("formcheck", undefined);
      Session.set("saved", undefined);
      Session.set("editing",undefined);
      Session.set("password",undefined);
      Session.set("error",undefined);
      Session.set("editor",undefined);
      Session.set("c",undefined);
      Session.set("cancelled", undefined);
    }

});

Template.homepage.helpers({
  list: function(){
      return places;
  }
})

Template.homepage.events({
  'click .chooseMe' : function(e){
      e.preventDefault();
//        var x=$('#destination').val();
      var x = this.key;
      var result=_.find(places, function(y) {return y.key === x;});
      Session.set("placename", result);
  },
  'click #edittrip': function(){
    Session.set("editing",true);
  }
})

Template.table.helpers({
    showPlace: function(){
        return Session.get("placename").title;
    },
    showlist: function(){
      if(Session.get("password")!=undefined){
        var password1 = Session.get("password");
        return Bookings.find({'phone': password1});
      }
      else{
        var placename = Session.get("placename");
        return Bookings.find({'place.key': placename.key});
      }
    },
    submit: function(){
      return Session.get("password");
    },
    dispdate: function(){
      return moment(this.date).format("dddd, MMMM Do");
    }
});

Template.table.events({
  'click .tripchoose': function(){
    Session.set("editor", true);
    Session.set("c", this);
  }

})

Template.addtrip.events({
    'click #addtrip': function(){
        Session.set("formcheck",true);
    }
});


Template.tripformtail.onRendered(function(){
    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15 // Creates a dropdown of 15 years to control year
    });
});

Template.tripform.events({
    'click #save': function(){
      var update = Session.get("editor");
        if(update){
          place = Session.get("c").place;
        }
        else{
        var place = Session.get("placename");
      }
        var saved = {
                  name: $('#name').val(),
                  phone: $('#phone').val(),
                  date: new Date($('#thedate').val()),
                  time: $('#time').val(),
                  place: place
                  };
        if (!saved.name || !saved.phone || !saved.date || !saved.time) {
          Session.set("error", true);
        }
        else {
          if(update){
            var same = Session.get("c");

            Bookings.update({'_id': same._id}, saved);
          }
          else{
              Bookings.insert(saved);
            }
          Session.set("error", undefined);
          Session.set("saved",true);
        }
    }
});

Template.tripform.helpers({
    dispdest: function(){
        return Session.get("placename").title;
    },
    error: function(){
        return Session.get("error");
    },
    c: function(){
        return Session.get("c");

}
});

Template.savedresponse.helpers({
    updated: function(){
        return Session.get("editor");
    }
});

Template.edit.events({
  'click #submit': function(){
     Session.set("password",$('#password').val());
  },
  'click #cancel': function(){
    var removing = Session.get("c");
    Bookings.remove({'_id': removing._id});
    Session.set("cancelled", true);
  }
});

Template.edit.helpers({

  submit: function(){
     return Session.get("password");
  },
  editor: function(){
    return Session.get("editor");
  }
});
