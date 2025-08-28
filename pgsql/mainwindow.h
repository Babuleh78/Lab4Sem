#ifndef MAINWINDOW_H
#define MAINWINDOW_H
#include <QSqlDatabase>
#include <QMainWindow>
#include <QDebug>
#include <QTableWidget>
#include <QTableWidgetItem>

QT_BEGIN_NAMESPACE
namespace Ui { class MainWindow; }
QT_END_NAMESPACE

class MainWindow : public QMainWindow
{

    Q_OBJECT

public:
    MainWindow(QWidget *parent = nullptr);
    ~MainWindow();

private:
    Ui::MainWindow *ui;
    QSqlDatabase dbconn;

private slots:
    void onTableItemClicked(QTableWidgetItem *item);
public slots:
    void dbconnect();
    void SelectFirst();
    void selectAll();
    void add();
    void del();
    void fillParticipantsForGroup(int groupId);
    void Find();
};
#endif // MAINWINDOW_H
