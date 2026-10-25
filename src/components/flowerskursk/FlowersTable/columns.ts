import { TableData } from "@/components/common/Table/TableData";
import { BaseColumn } from "@/components/common/Table/ColumnsStore";
import { SaveProvider } from "@/common/saveData/SaveProvider";
import CellString from "@/components/common/TablesCells/CellString";

import flowersTableStore, { TFlowersOrder } from "../store/FlowersTableStore";
import CellStatus from "../cells/CellStatus";
import CellPayment from "../cells/CellPayment";
import CellCustomer from "../cells/CellCustomer";
import CellRecipient from "../cells/CellRecipient";
import CellDelivery from "../cells/CellDelivery";
import CellItems from "../cells/CellItems";
import CellPrice from "../cells/CellPrice";
import CellCardText from "../cells/CellCardText";
import CellFlags from "../cells/CellFlags";

const tableData = new TableData(
    [
        new BaseColumn<TFlowersOrder, "orderNumber">("orderNumber", CellString).Title("№ Заказа"),
        new BaseColumn<TFlowersOrder, "status">("status", CellStatus).Title("Статус"),
        new BaseColumn<TFlowersOrder, "date">("date", CellString).Title("Дата создания"),
        new BaseColumn<TFlowersOrder, "deliveryCell">("deliveryCell", CellDelivery).Title("Доставка и время"),
        new BaseColumn<TFlowersOrder, "customerCell">("customerCell", CellCustomer).Title("Заказчик"),
        new BaseColumn<TFlowersOrder, "recipientCell">("recipientCell", CellRecipient).Title("Получатель"),
        new BaseColumn<TFlowersOrder, "items">("items", CellItems).Title("Состав заказа"),
        new BaseColumn<TFlowersOrder, "priceCell">("priceCell", CellPrice).Title("Сумма"),
        new BaseColumn<TFlowersOrder, "paymentCell">("paymentCell", CellPayment).Title("Оплата"),
        new BaseColumn<TFlowersOrder, "cardText">("cardText", CellCardText).Title("Открытка"),
        new BaseColumn<TFlowersOrder, "flagsCell">("flagsCell", CellFlags).Title("Опции / Заметки"),
    ],
    () => flowersTableStore.resultTable,
    new SaveProvider("FlowersTableSettings")
);

export default tableData;
