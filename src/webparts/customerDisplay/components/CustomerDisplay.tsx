import * as React from 'react';
import styles from './CustomerDisplay.module.scss';
import { ICustomerDisplayProps } from './ICustomerDisplayProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class CustomerDisplay extends React.Component<ICustomerDisplayProps, {}> {
  public render(): React.ReactElement<ICustomerDisplayProps> {
    return (
      <div className={ styles.customerDisplay }>
        <div className={ styles.container }>
          <div className={ styles.row }>
          <div className={ styles.column }>
              <p className={ styles.title }> Intract with Customer Items in the Customer List</p>
              <a href="#" className={ styles.button } onClick={ this.onGetListItemsClicked }>
                <span className={ styles.label }>Get Customers</span>
              </a>
              
              <a href="#" className={ styles.button } onClick={ this.onAddListItemClicked }>
                <span className={ styles.label }>Create Customer</span>
              </a>
              <a href="#" className={ styles.button } onClick={ this.onUpdateListItemClicked }>
                <span className={ styles.label }>Update Customer</span>
              </a>
              <a href="#" className={ styles.button } onClick={ this.onDeleteListItemClicked }>
                <span className={ styles.label }>Delete Customer</span>
                </a>

            </div>
          </div>

          <div className={ styles.row }>
            <ul className={ styles.list }>
              { this.props.spListItems &&
                this.props.spListItems.map((list) =>
                  <li key={list.Id} className={styles.item}>
                    <strong>Id:</strong> {list.Id}, <strong>Company:</strong> {list.Title}, <strong>First Name:</strong> {list.FirstName}, <strong>Mobile Number:</strong> {list.CellPhone}
                  </li>
                )
              }
            </ul>
          </div>

        </div>
      </div>
    );
  }
  private onGetListItemsClicked = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    event.preventDefault();
  
    this.props.onGetListItems();
  }  

  private onAddListItemClicked = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    event.preventDefault();
  
    this.props.onAddListItem();
  }
  
  private onUpdateListItemClicked = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    event.preventDefault();
  
    this.props.onUpdateListItem();
  }
  
  private onDeleteListItemClicked = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    event.preventDefault();
  
    this.props.onDeleteListItem();
  }  
}
