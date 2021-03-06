/*
  backgrid
  http://github.com/wyuenho/backgrid

  Copyright (c) 2013 Jimmy Yuen Ho Wong
  Licensed under the MIT @license.
*/
describe("A Row", function () {

  it("throws TypeError if a model is not given", function () {
    expect(function () {
      new Backgrid.Row({
        columns: [{
          name: "name",
          cell: "string"
        }]
      });
    }).toThrow(new TypeError("'model' is required"));
  });

  it("throws TypeError if a list of column definitions is not given", function () {
    expect(function () {
      new Backgrid.Row({
        model: new Backbone.Model()
      });
    }).toThrow(new TypeError("'columns' is required"));
  });

  it("renders a row of cells using a model's values and a list of column definitions", function () {
    var row = new Backgrid.Row({
      model: new Backbone.Model({
        name: "name",
        age: 18
      }),
      columns: [{
        name: "name",
        cell: "string"
      }, {
        name: "age",
        cell: "integer"
      }]
    });

    row.render();

    expect(row.el.tagName).toBe("TR");

    var $tds = row.$el.children();
    expect($tds.eq(0).text()).toBe("name");
    expect($tds.eq(1).text()).toBe("18");
  });

  it("inserts or removes a cell if a column's renderable attribute changes", function () {

    var row = new Backgrid.Row({
      model: new Backbone.Model({
        name: "name",
        age: 18,
        birthday: "1987-06-05"
      }),
      columns: [{
        name: "name",
        cell: "string"
      }, {
        name: "age",
        cell: "integer",
        renderable: false
      }, {
        name: "birthday",
        cell: "date"
      }]
    });

    row.render();

    var $tds = row.$el.children();
    expect($tds.length).toBe(2);
    expect($tds.eq(0).text()).toBe("name");
    expect($tds.eq(1).text()).toBe("1987-06-05");

    row.columns.at(1).set("renderable", true);
    $tds = row.$el.children();
    expect($tds.eq(0).text()).toBe("name");
    expect($tds.eq(1).text()).toBe("18");
    expect($tds.eq(2).text()).toBe("1987-06-05");

    row.columns.at(0).set("renderable", false);
    $tds = row.$el.children();
    expect($tds.eq(0).text()).toBe("18");
    expect($tds.eq(1).text()).toBe("1987-06-05");

    row.columns.at(2).set("renderable", false);
    $tds = row.$el.children();
    expect($tds.eq(0).text()).toBe("18");

    row.columns.at(0).set("renderable", true);
    row.columns.at(2).set("renderable", true);
    $tds = row.$el.children();
    expect($tds.eq(0).text()).toBe("name");
    expect($tds.eq(1).text()).toBe("18");
    expect($tds.eq(2).text()).toBe("1987-06-05");
  });

  it("inserts or removes a cell if a column is added or removed", function () {
    var row = new Backgrid.Row({
      model: new Backbone.Model({
        name: "name",
        age: 18,
        birthday: "1987-06-05"
      }),
      columns: [{
        name: "name",
        cell: "string"
      }]
    });

    row.render();

    row.columns.add({name: "age", cell: "integer"});
    var $tds = row.$el.children();
    expect($tds.length).toBe(2);
    expect($tds.eq(1).text()).toBe("18");

    row.columns.add({name: "birthday", cell: "date"}, {render: false});
    $tds = row.$el.children();
    expect($tds.length).toBe(2);
    expect($tds.last().text()).toBe("18");

    row.columns.remove(row.columns.first());
    $tds = row.$el.children();
    expect($tds.length).toBe(1);
    expect($tds.last().text()).toBe("18");
  });

});
