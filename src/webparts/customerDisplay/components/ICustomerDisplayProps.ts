import {
  ButtonClickedCallback,
  ICustomerDisplay
} from '../../../models';

export interface ICustomerDisplayProps {
  spListItems: ICustomerDisplay[];
  onGetListItems?: ButtonClickedCallback;
  onAddListItem?: ButtonClickedCallback;
  onUpdateListItem?: ButtonClickedCallback;
  onDeleteListItem?: ButtonClickedCallback;
}
