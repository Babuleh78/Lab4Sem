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
}

MainWindow::~MainWindow()
{
    if( dbconn.isOpen())
        dbconn.close();
    delete ui;
}

void MainWindow::dbconnect()
{
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
    if( dbconn.open() )
    ui->teResult->append("Connect is open...");
    else
        {
        ui->teResult->append("Error of connect:");
        ui->teResult->append(dbconn.lastError().text());
        }
    }
    else
        ui->teResult->append("Connect is already open...");
}


void MainWindow::selectAll()
{
    // Очистить содержимое компонента
    ui->twOrg->clearContents();
    qDebug() << "Nachinaem";
    if( !dbconn.isOpen() )
    {
    dbconnect();
    if( !dbconn.isOpen() )
    {
        qDebug() << dbconn.lastError().text();
        //QMessageBox::critical(this,"Error",dbconn.lastError().text());
        return;
        }
    }
    // Создать объект запроса с привязкой к установленному соединению
    QSqlQuery query(dbconn);
    // Создать строку запроса на выборку данных
    QString sqlstr = "SELECT * FROM collective;";
    // Выполнить запрос и поверить его успешность
    if( !query.exec(sqlstr) )
    {
    QMessageBox::critical(this,"Error", query.lastError().text());
    return;
    }
    // Если запрос активен (успешно завершен),
    // то вывести сообщение о прочитанном количестве строк в окно вывода
    // и установить количество строк для компонента таблицы
    if( query.isActive())
    ui->twOrg->setRowCount( query.size());
    else
    ui->twOrg->setRowCount( 0);
    ui->teResult->append( QString("Read %1 rows").arg(query.size()));
    // Прочитать в цикле все строки результата (курсора)
    // и вывести их в компонент таблицы

    // Количество столбцов
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
    QString sqlstr = "insert into org(abbr,title,city,inn) values(?,?,?,?)";
    // Подготовить запрос
    query.prepare(sqlstr);
    // Передать параметры из полей ввода в запрос
    query.bindValue(0,ui->leAbbr->text());
    query.bindValue(1,ui->teTitle->toPlainText());
    query.bindValue(2,ui->leCity->text());
    // Если тип поля отличается от строкового, то преобразовать его
    query.bindValue(3,ui->leInn->text().toLongLong());
    // Выполнить запрос
    if( !query.exec() )
    {
    ui->teResult->append( query.lastQuery());
    QMessageBox::critical(this,"Error",query.lastError().text());
    return;
    }
    // Если запрос выполнен, то вывести сообщение одобавлении строки
    ui->teResult->append( QString("AddRead %1
    rows").arg(query.numRowsAffected()) );
    // и обновить записи в компоненте таблицы
    selectAll();
}
