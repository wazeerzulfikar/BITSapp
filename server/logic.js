Meteor.publish("futuretrips", function(){
  return Bookings.find({date: {$gte: new Date(), $lt: new Date(moment().add(7, 'days'))}});
})
