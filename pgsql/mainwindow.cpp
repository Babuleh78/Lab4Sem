#include "mainwindow.h"
#include "ui_mainwindow.h"
#include <QSqlDatabase>
#include <QSqlError>
#include <QSqlQuery>
#include <QMessageBox>

MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MainWindow)
{
    ui->setupUi(this);
    connect(ui->btnConnect,SIGNAL(clicked(bool)),this, SLOT(dbconnect()));

    connect(ui->btnSelectAll,SIGNAL(clicked(bool)),this, SLOT(selectAll()));

    connect(ui->btnAdd,SIGNAL(clicked(bool)),this, SLOT(add()));

    connect(ui->btnDel,SIGNAL(clicked(bool)), this, SLOT(del()));

    connect(ui->btnSelectFirst,SIGNAL(clicked(bool)), this, SLOT(SelectFirst()));

    connect(ui->btnFind,SIGNAL(clicked(bool)), this, SLOT(Find()));

    connect(ui->twOrg, &QTableWidget::itemClicked, this, &MainWindow::onTableItemClicked);
}

MainWindow::~MainWindow()
{
    if( dbconn.isOpen())
        dbconn.close();
    delete ui;
}

void MainWindow::dbconnect()
{
    qDebug() << "dbconnect";
    if(!dbconn.isOpen())
    {
    // Если соединение не открыто, то вывести список доступных драйверов БД
    // (вывод в поле teResult, метод append добавляет строки).
    ui->teResult->append("SQL drivers:");
    ui->teResult->append(QSqlDatabase::drivers().join(","));
    // Создать глобальную переменную для установки соединения с БД
    dbconn=QSqlDatabase::addDatabase("QPSQL");

    dbconn.setDatabaseName("dbtest");
    dbconn.setHostName("localhost");
    dbconn.setUserName("student");
    dbconn.setPassword("1");
    // Открыть соединениe и результат вывести в окно вывода
    if( dbconn.open() ){
        ui->teResult->append("Connect is open...");
        SelectFirst();

    }
    else
        {
        ui->teResult->append("Error of connect:");
        ui->teResult->append(dbconn.lastError().text());
        }
    }
    else
        ui->teResult->append("Connect is already open...");
}

void MainWindow::SelectFirst()
{

    ui->twOrg->clearContents();
    qDebug() << "SelectFirst";

    if (!dbconn.isOpen())
    {
        dbconnect();
        if (!dbconn.isOpen())
        {
            qDebug() << dbconn.lastError().text();
            QMessageBox::critical(this, "Error", dbconn.lastError().text());
            return;
        }
    }

    QSqlQuery query(dbconn);
    QString sqlstr = "SELECT * FROM collective LIMIT 1;";

    if (!query.exec(sqlstr))
    {
        QMessageBox::critical(this, "Error", query.lastError().text());
        return;
    }

    if (query.isActive() && query.next()) // Переходим к первой записи
    {

        ui->twOrg->setRowCount(1);
        ui->twOrg->setColumnCount(4);

        ui->twOrg->setItem(0, 0, new QTableWidgetItem(query.value("group_id").toString()));
        ui->twOrg->setItem(0, 1, new QTableWidgetItem(query.value("group_name").toString()));
        ui->twOrg->setItem(0, 2, new QTableWidgetItem(query.value("genre").toString()));
        ui->twOrg->setItem(0, 3, new QTableWidgetItem(query.value("site").toString()));

        ui->twOrg->setHorizontalHeaderItem(0, new QTableWidgetItem("ID"));
        ui->twOrg->setHorizontalHeaderItem(1, new QTableWidgetItem("Name"));
        ui->twOrg->setHorizontalHeaderItem(2, new QTableWidgetItem("Genre"));
        ui->twOrg->setHorizontalHeaderItem(3, new QTableWidgetItem("Site"));

        // Последний столбец растягивается при изменении размера формы
        ui->twOrg->horizontalHeader()->setStretchLastSection(true);


        ui->twOrg->setEditTriggers(QAbstractItemView::NoEditTriggers);
    }
    else
    {
        ui->twOrg->setRowCount(0); // Если нет записей, устанавливаем 0 строк
        QMessageBox::information(this, "Info", "No records found.");
    }
}

void MainWindow::fillParticipantsForGroup(int groupId)
{

    ui->partOrg->clearContents();
    ui->partOrg->setRowCount(0);

    if(!dbconn.isOpen()) {
        dbconnect();
        if(!dbconn.isOpen()) {
            qDebug() << dbconn.lastError().text();
            return;
        }
    }

    QSqlQuery query(dbconn);
    QString sqlstr = QString("SELECT part_name, part_role FROM participant WHERE group_id = %1").arg(groupId);

    if(!query.exec(sqlstr)) {
        QMessageBox::critical(this, "Error", query.lastError().text());
        return;
    }

    ui->partOrg->setRowCount(query.size());

    ui->partOrg->setColumnCount(2);
    ui->partOrg->setHorizontalHeaderLabels({"Name", "Role"});


    int row = 0;
    while(query.next()) {
        ui->partOrg->setItem(row, 0, new QTableWidgetItem(query.value("part_name").toString()));
        ui->partOrg->setItem(row, 1, new QTableWidgetItem(query.value("part_role").toString()));
        row++;
    }
}

void MainWindow::onTableItemClicked(QTableWidgetItem *item)
{
    int row = item->row();
    int groupId = ui->twOrg->item(row, 0)->text().toInt();

    fillParticipantsForGroup(groupId);
}

void MainWindow::Find()
{
    ui->twOrg->clearContents();
    ui->twOrg->setRowCount(0);

    if (!dbconn.isOpen()) {
        dbconnect();
        if (!dbconn.isOpen()) {
            QMessageBox::critical(this, "Error", dbconn.lastError().text());
            return;
        }
    }

    QStringList conditions;
    QVariantList values;

    if (!ui->leId->text().isEmpty()) {
        conditions << "group_id = ?";
        values << ui->leId->text().toInt();
    }
    if (!ui->leName->text().isEmpty()) {
        conditions << "group_name LIKE ?";
        values << "%" + ui->leName->text() + "%";
    }
    if (!ui->leGenre->text().isEmpty()) {
        conditions << "genre LIKE ?";
        values << "%" + ui->leGenre->text() + "%";
    }
    if (!ui->leSite->toPlainText().isEmpty()) {
        conditions << "site LIKE ?";
        values << "%" + ui->leSite->toPlainText() + "%";
    }

    QString sqlstr = "SELECT * FROM collective";
    if (!conditions.isEmpty()) {
        sqlstr += " WHERE " + conditions.join(" AND ");
    }

    QSqlQuery query(dbconn);
    query.prepare(sqlstr);

    foreach (const QVariant &value, values) {
        query.addBindValue(value);
    }

    if (!query.exec()) {
        QMessageBox::critical(this, "Error", query.lastError().text());
        return;
    }

    ui->twOrg->setColumnCount(4);
    ui->twOrg->setHorizontalHeaderLabels({"id", "Name", "Genre", "Site"});
    ui->twOrg->horizontalHeader()->setStretchLastSection(true);
    ui->twOrg->setEditTriggers(QAbstractItemView::NoEditTriggers);


    int row = 0;
    while (query.next()) {
        ui->twOrg->insertRow(row);
        ui->twOrg->setItem(row, 0, new QTableWidgetItem(query.value("group_id").toString()));
        ui->twOrg->setItem(row, 1, new QTableWidgetItem(query.value("group_name").toString()));
        ui->twOrg->setItem(row, 2, new QTableWidgetItem(query.value("genre").toString()));
        ui->twOrg->setItem(row, 3, new QTableWidgetItem(query.value("site").toString()));
        row++;
    }

    ui->teResult->append(QString("Found %1 rows").arg(row));
}

void MainWindow::selectAll()
{

    ui->twOrg->clearContents();
    qDebug() << "selectAll";
    if( !dbconn.isOpen() )
    {
    dbconnect();
    if( !dbconn.isOpen() )
    {
        qDebug() << dbconn.lastError().text();
        return;
        }
    }
    QSqlQuery query(dbconn);
    QString sqlstr = "SELECT* FROM collective";
    if( !query.exec(sqlstr) )
    {
    QMessageBox::critical(this,"Error", query.lastError().text());
    return;
    }

    if( query.isActive())
        ui->twOrg->setRowCount( query.size());
    else
        ui->twOrg->setRowCount( 0);

    ui->teResult->append( QString("Read %1 rows").arg(query.size()));
   
    ui->twOrg->setColumnCount(4);
    // Возможность прокрутки
    ui->twOrg->setAutoScroll(true);
    // Режим выделения ячеек - только одна строка
    ui->twOrg->setSelectionMode(QAbstractItemView::SingleSelection);
    ui->twOrg->setSelectionBehavior(QAbstractItemView::SelectRows);
    // Заголовки таблицы
    ui->twOrg->setHorizontalHeaderItem(0,new QTableWidgetItem("id"));
    ui->twOrg->setHorizontalHeaderItem(1,new QTableWidgetItem("Name"));
    ui->twOrg->setHorizontalHeaderItem(2,new QTableWidgetItem("Genre"));
    ui->twOrg->setHorizontalHeaderItem(3,new QTableWidgetItem("Site"));
    // Последний столбец растягивается при изменении размера формы
    ui->twOrg->horizontalHeader()->setStretchLastSection(true);
    // Разрешаем сортировку пользователю
    ui->twOrg->setSortingEnabled(true);
    ui->twOrg->sortByColumn(0);
    // Запрет на изменение ячеек таблицы при отображении
    ui->twOrg->setEditTriggers(QAbstractItemView::NoEditTriggers);
    int i=0;

    while(query.next())
    {
        ui->twOrg->setItem(i,0,new
        QTableWidgetItem(query.value("group_id").toString()));
        ui->twOrg->setItem(i,1,new
        QTableWidgetItem(query.value("group_name").toString()));
        ui->twOrg->setItem(i,2,new
        QTableWidgetItem(query.value("genre").toString()));
        ui->twOrg->setItem(i,3,new
        QTableWidgetItem(query.value("site").toString()));
        i++;
    }
}

void MainWindow::add()
{
    qDebug() << "add";
    // Подключиться к БД
    if( !dbconn.isOpen() )
    {
    dbconnect();
    if( !dbconn.isOpen() )
    {
    QMessageBox::critical(this,"Error",dbconn.lastError().text());
    return;
    }
    }
    QSqlQuery query(dbconn);
    // Создать строку запроса
    QString sqlstr = "insert into collective(group_id,group_name,genre,site) values(?,?,?,?)";
    // Подготовить запрос
    query.prepare(sqlstr);
    // Передать параметры из полей ввода в запрос

    query.bindValue(1,ui->leName->text());
    query.bindValue(3,ui->leSite->toPlainText());
    query.bindValue(2,ui->leGenre->text());
    // Если тип поля отличается от строкового, то преобразовать его
    query.bindValue(0,ui->leId->text().toInt());
    // Выполнить запрос
    qDebug() << "here";
    if( !query.exec() )
    {
        qDebug() << "ne fortanulo";
    ui->teResult->append( query.lastQuery());
    QMessageBox::critical(this,"Error",query.lastError().text());
    return;
    }
    // Если запрос выполнен, то вывести сообщение одобавлении строки
    ui->teResult->append( QString("AddRead %1rows").arg(query.numRowsAffected()) );
    // и обновить записи в компоненте таблицы
    selectAll();
}

void MainWindow::del()
{
    qDebug() << "del";
    // Подключение к БД
    if( !dbconn.isOpen() )
    {
    dbconnect();
    if( !dbconn.isOpen() )
    {
    QMessageBox::critical(this,"Error",dbconn.lastError().text());
    return;
    }
    }
    // Получить номер выбранной строки в компоненте таблицы
    int currow = ui->twOrg->currentRow();
    // Если он меньше 0 (строка не выбрана), то
    // сообщение об ошибке и выход из функции
    if( currow < 0 )
    {
    QMessageBox::critical(this,"Error","Not selected row!");
    return;
    }
    // Спросить у пользователя подтверждение удаления записи
    // Используется статический метод QMessageBox::question
    // для задания вопроса, который возвращает код нажатой кнопки
    if( QMessageBox::question(this,"Delete","Delete row?",
    QMessageBox::Cancel,QMessageBox::Ok)==QMessageBox::Cancel)
    return;
    // Создать объект запроса
    QSqlQuery query(dbconn);
    QString sqlstr = "delete from org where abbr = '"
    + ui->twOrg->item(currow,0)->text() + "'";
    // Выполнить строку запроса и проверить его успешность
    if( !query.exec(sqlstr) )
    {
    ui->teResult->append( query.lastQuery());
    QMessageBox::critical(this,"Error",query.lastError().text());
    return;
    }
    // Вывести сообщение об удалении строки
    ui->teResult->append( QString("Del %1 rows").arg(query.numRowsAffected()) );
    // Обновить содержимое компонента таблицы
    selectAll();
 }
