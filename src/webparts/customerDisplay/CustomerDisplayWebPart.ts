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
        onGetListItems: this._onGetListItems
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
