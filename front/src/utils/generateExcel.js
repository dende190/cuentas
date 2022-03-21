function generateExcel(json) {
  const date = new Date();
  const timestamp = (
    date.getFullYear() +
    ('0'+(date.getMonth()+1)).slice(-2) +
    ('0'+date.getDate()).slice(-2) +
    '_' +
    ('0'+date.getHours()).slice(-2) +
    ('0'+date.getMinutes()).slice(-2)
  );
  let table = '';
  for (let title in json) {
    table += (
      '<tr>' +
        '<td>' +
            '<h3>' + title + '</h3>' +
        '</td>' +
      '</tr>'
    );
    json[title].forEach(bill => {
      table += (
        '<tr>' +
          '<td>' +
            '<h4>' + bill.description + '</h4>' +
          '</td>' +
          '<td>' +
            '<h4>' + bill.payment + '</h4>' +
          '</td>' +
          '<td>' +
            '<h4>' + bill.paidOut + '</h4>' +
          '</td>' +
          '<td>' +
            '<h4>' + (bill.paid ? 'PAGADO' : 'FALTA') + '</h4>' +
          '</td>' +
        '</tr>'
      );
      bill.debtors.forEach(debtor => {
        table += (
          '<tr>' +
            '<td>' + (debtor.paid === 1 ? '√' : 'x') + '</td>' +
            '<td>' + debtor.name + '</td>' +
            '<td>' + debtor.expense + '</td>' +
          '</tr>'
        );
      });
      table += '<tr></tr>';
    });
  }

  const xmlToReport = (
    'data:application/vnd.ms-excel;base64,' +
    window.btoa(
      (
        '<html ' +
          'xmlns:o="urn:schemas-microsoft-com:office:office" ' +
          'xmlns:x="urn:schemas-microsoft-com:office:excel" ' +
          'xmlns="http://www.w3.org/TR/REC-html40"' +
        '>' +
          '<head>' +
            '<!--[if gte mso 9]>' +
              '<xml>' +
                '<x:ExcelWorkbook>' +
                  '<x:ExcelWorksheets>' +
                    '<x:ExcelWorksheet>' +
                      '<x:Name>' +
                        timestamp +
                      '</x:Name>' +
                      '<x:WorksheetOptions>' +
                        '<x:ActivePane>2</x:ActivePane>'+
                        '<x:DisplayGridlines/>' +
                        '<x:FreezePanes/>'+
                        '<x:FrozenNoSplit/>'+
                        '<x:SplitHorizontal>1</x:SplitHorizontal>'+
                        '<x:TopRowBottomPane>1</x:TopRowBottomPane>'+
                      '</x:WorksheetOptions>' +
                    '</x:ExcelWorksheet>' +
                  '</x:ExcelWorksheets>' +
                '</x:ExcelWorkbook>' +
              '</xml>' +
            '<![endif]-->' +
          '</head>' +
          '<body>' +
            '<table>' +
              '<tbody>' +
                table +
              '</tbody>' +
            '</table>' +
          '</body>' +
        '</html>'
      )
      .replace(/[\u00A0-\u2666]/g, function(caracter) {
        return ('&#' + caracter.charCodeAt(0) + ';');
      })
    )
  );

  const dDownloadButton = document.createElement('a');
  dDownloadButton.href = xmlToReport;
  dDownloadButton.download = (timestamp + '.xls');
  dDownloadButton.click();
}

export default generateExcel;
