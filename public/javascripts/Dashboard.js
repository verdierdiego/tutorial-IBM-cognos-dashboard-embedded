var Dashboard = (function (){

  var session = {
    code: "",
    id: "",
    keys: []
  }

  return {
    createSession: createNewSession,
    initialize: createAndInitApiFramework,
    create: createDashboard,
    addSource: addSource,
    saveDashboard: saveDashboard,
    openDashboard: openDashboard
  };

  async function createNewSession() {
    session;
    if (this.api != null) {
      console.log("there was already an api object");
    } else {
      var http = new XMLHttpRequest();
      http.open('POST', '/api/dde/session', true);
      http.setRequestHeader('Content-type', 'application/json');
      http.onreadystatechange = function() {
        if (http.readyState === 4 && http.status === 200 && http.responseText) {
          response = http.responseText
          const data = JSON.parse(response);
          session.code = data.sessionCode;
          session.id = data.sessionId;
          session.keys = data.keys;

          createAndInitApiFramework();
          return this.session;
        }
      };
      http.send()
    }
  }

  async function createAndInitApiFramework() {
    console.log("in create and init api framework");

    // Create an instance of the CognosApi
    this.api = new CognosApi({
      cognosRootURL: 'https://us-south.dynamic-dashboard-embedded.cloud.ibm.com/daas/',
      sessionCode: session.code,
      initTimeout: 10000,
      node: document.getElementById('dashboardPlace') // containerDivId
    });

    this.api._node.hidden = false;

    try {
      await this.api.initialize();
      console.log('API created successfully.');
      createDashboard();
    } catch (e) {
      console.log('Unable to initialize API instance: ' + e.message);
      throw e;
    }

    return this.api.apiId;
  }

  async function createDashboard()  {
    if (this.api.dashboard != null) {
      this.dashboardAPI = await this.api.dashboard.createNew();
      console.log('Dashboard created successfully.');
      this.dashboardAPI.state = 'Create';
      dashboardAPI.on('addSource:clicked', sourceClicked) // Con esta sentencia estamos "escuchando" el evento que se dispara cuando se le da click al boton de agregar una fuente de datos dentro de un archivo.
      return this.dashboardAPI;
    } else {
      console.log('Dashboard is not created.');
    }
  }

  async function addSource()  {
    sampleModule = {
      "xsd":"https://ibm.com/daas/module/1.0/module.xsd",
      "source": {
        "id": "StringID",
        "srcUrl": {
          "sourceUrl": "https://developer.ibm.com/static/site-id/141/ddeCSVSample.csv",
          "mimeType": "text/csv",
          "property": [
            {
              "name": "headers",
              "value": [
                {
                  "name": "x-header-1",
                  "value": "someheadervalue"
                },
                {
                  "name": "x-header-2",
                  "value": "someotherheadervalue"
                }
              ]
            }
          ]
        }
      },
      "table": {
        "name": "TableName",
        "column": [
          {
            "datatype": "BIGINT",
            "nullable": true,
            "name": "Year_",
            "description": "Year",
            "label": "Year",
            "usage": "attribute",
            "regularAggregate": "none",
            "taxonomyFamily": "cYear"
          },
          {
            "datatype": "NVARCHAR(20)",
            "nullable": true,
            "name": "Product_type",
            "description": "Product type",
            "label": "Product type",
            "usage": "attribute",
            "regularAggregate": "none"
          },
          {
            "datatype": "NVARCHAR(17)",
            "nullable": true,
            "name": "Order_method_type",
            "description": "Order method type",
            "label": "Order method type",
            "usage": "attribute",
            "regularAggregate": "none"
          },
          {
            "name": "Retailer_country",
            "datatype": "NVARCHAR(16)",
            "nullable": true,
            "description": "Retailer country",
            "label": "Retailer country",
            "usage": "attribute",
            "regularAggregate": "none",
            "taxonomyFamily": "cCountry"
          },
          {
            "datatype": "DOUBLE",
            "nullable": true,
            "name": "Revenue",
            "description": "Revenue",
            "label": "Revenue",
            "usage": "fact",
            "regularAggregate": "total"
          },
          {
            "datatype": "DECIMAL(38, 0)",
            "nullable": true,
            "name": "Quantity",
            "description": "Quantity",
            "label": "Quantity",
            "usage": "fact",
            "regularAggregate": "total"
          }
        ]
      },
      "label": "Module Name",
      "identifier": "moduleId"
    }

    dashboardAPI.addSources([{
      module: sampleModule,
      name: 'Test Source',
      id: 'myUniqueId123'
    }])
  }

  function sourceClicked(event) {
    addSource()
  }

  async function saveDashboard()  {
    if (this.api.dashboard != null) {
      var dashboardSpec = this.dashboardAPI.getSpec();

      // Conectarse con Mongo/Cloudant.
      // Guardar dashboardSpec

      console.log('Dashboard was successfully saved.');
    } else {
      console.log('Dashboard was not saved.');
    }
  }

  async function openDashboard()  {
    // Pedirle a Mongo/Cloudant dashboards guardados
    try {
      this.dashboardAPI = await this.api.dashboard.openDashboard({
        dashboardSpec: "dashboard elegido"
      })
      console.log("Dashboard successfully loaded")
    } catch (e) {
      console.log('Unable to load that Dashboard: ' + e.message);
      throw e;
    }
  }

}());

