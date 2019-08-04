import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';

import * as strings from 'CustomerDisplayWebPartStrings';
import CustomerDisplay from './components/CustomerDisplay';
import { ICustomerDisplayProps } from './components/ICustomerDisplayProps';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { ICustomerDisplay } from '../../models';

export interface ICustomerDisplayWebPartProps {
  description: string;
}

export default class CustomerDisplayWebPart extends BaseClientSideWebPart<ICustomerDisplayWebPartProps> {
  private _customers: ICustomerDisplay[] = [];

  public render(): void {
    const element: React.ReactElement<ICustomerDisplayProps > = React.createElement(
      CustomerDisplay,
      {
        spListItems: this._customers,
        onGetListItems: this._onGetListItems,
        onAddListItem: this._onAddListItem,
        onUpdateListItem: this._onUpdateListItem,
        onDeleteListItem: this._onDeleteListItem     
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  private _onGetListItems = (): void => {
    this._getListItems()
      .then(response => {
        this._customers = response;
        this.render();
      });
  }  

  private _onAddListItem = (): void => {
    this._addListItem()
      .then(() => {
        this._getListItems()
          .then(response => {
            this._customers = response;
            this.render();
          });
      });
  }
  
  private _onUpdateListItem = (): void => {
    this._updateListItem()
      .then(() => {
        this._getListItems()
          .then(response => {
            this._customers = response;
            this.render();
          });
      });
  }
  
  private _onDeleteListItem = (): void => {
    this._deleteListItem()
      .then(() => {
        this._getListItems()
          .then(response => {
            this._customers = response;
            this.render();
          });
      });
  }


  private _getListItems(): Promise<ICustomerDisplay[]> {
    return this.context.spHttpClient.get(
      this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('Customers')/items?$select=Id,Title,FirstName,CellPhone`, 
      SPHttpClient.configurations.v1)
      .then(response => {
        return response.json();
      })
      .then(jsonResponse => {
        return jsonResponse.value;
      }) as Promise<ICustomerDisplay[]>;
  }  

  private _getItemEntityType(): Promise<string> {
    return this.context.spHttpClient.get(
        this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('Customers')?$select=ListItemEntityTypeFullName`,
        SPHttpClient.configurations.v1)
      .then(response => {
        return response.json();
      })
      .then(jsonResponse => {
        return jsonResponse.ListItemEntityTypeFullName;
      }) as Promise<string>;
  }

  private _addListItem(): Promise<SPHttpClientResponse> {
    return this._getItemEntityType()
      .then(spEntityType => {
        const request: any = {};
        request.body = JSON.stringify({
          Title: "Created: " + new Date().toUTCString(),
          CellPhone: Math.floor(Math.random() * 1000000000).toString(),
          '@odata.type': spEntityType
        });
  
        return this.context.spHttpClient.post(
          this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('Customers')/items`,
          SPHttpClient.configurations.v1,
          request);
        }
      ) ;
  }  

  private _updateListItem(): Promise<SPHttpClientResponse> {
    // get the first item
    return this.context.spHttpClient.get(
        this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('Customers')/items?$select=Id,Title&$filter=Title eq 'TEST'`, 
        SPHttpClient.configurations.v1)
      .then(response => {
        return response.json();
      })
      .then(jsonResponse => {
        return jsonResponse.value[0];
      })
      .then((listItem: ICustomerDisplay) => {
        // update item
        listItem.Title = 'UPDATE';
        // save it
        const request: any = {};
        request.headers = {
          'X-HTTP-Method': 'MERGE',
          'IF-MATCH': (listItem as any)['@odata.etag']
        };
        request.body = JSON.stringify(listItem);
  
        return this.context.spHttpClient.post(
          this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('Customers')/items(${listItem.Id})`,
          SPHttpClient.configurations.v1,
          request);
      });
  }  

  private _deleteListItem(): Promise<SPHttpClientResponse> {
    // get the last item
    return this.context.spHttpClient.get(
        this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('Customers')/items?$select=Id,Title&$filter=Title eq 'UPDATE'`, 
        SPHttpClient.configurations.v1)
      .then(response => {
        return response.json();
      })
      .then(jsonResponse => {
        return jsonResponse.value[0];
      })
      .then((listItem: ICustomerDisplay) => {
        const request: any = {};
        request.headers = {
          'X-HTTP-Method': 'DELETE',
          'IF-MATCH': '*'
        };
        request.body = JSON.stringify(listItem);
  
        return this.context.spHttpClient.post(
          this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('Customers')/items(${listItem.Id})`,
          SPHttpClient.configurations.v1,
          request);
      });
  }  


  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
