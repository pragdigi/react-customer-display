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
              <p className={ styles.title }> Customers from list!</p>
              <a href="#" className={ styles.button } onClick={ this.onGetListItemsClicked }>
                <span className={ styles.label }>Get Customers</span>
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
}
