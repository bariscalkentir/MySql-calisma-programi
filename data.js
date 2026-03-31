const mysqlData = [
  {
    id: 1, title: "Veri Sorgulama", titleEn: "Querying Data",
    topics: [
      { name: "SELECT FROM", desc: "Bir tablodan veri çekmek için kullanılır. SQL'in en temel ifadesidir.",
        syntax: "SELECT sütun1, sütun2, ...\nFROM tablo_adı;",
        examples: [
          { 
            label: "Tek sütun", 
            code: "SELECT lastName\nFROM employees;",
            output: {
              headers: ["lastName"],
              rows: [["Murphy"], ["Patterson"], ["Firrelli"], ["Bow"], ["Bondur"]]
            }
          },
          { 
            label: "Birden fazla sütun", 
            code: "SELECT lastName, firstName, jobTitle\nFROM employees;",
            output: {
              headers: ["lastName", "firstName", "jobTitle"],
              rows: [
                ["Murphy", "Diane", "President"],
                ["Patterson", "Mary", "VP Sales"],
                ["Firrelli", "Jeff", "VP Marketing"]
              ]
            }
          },
          { 
            label: "Tüm sütunlar", 
            code: "SELECT *\nFROM employees;",
            output: {
              headers: ["employeeNum", "lastName", "firstName", "ext", "email", "officeCode", "reportsTo", "jobTitle"],
              rows: [
                ["1002", "Murphy", "Diane", "x5800", "dmurphy@...", "1", "NULL", "President"],
                ["1056", "Patterson", "Mary", "x4611", "mpatterso@...", "1", "1002", "VP Sales"]
              ],
              note: "Gerçekte tablodaki tüm satır ve sütunlar gelir."
            }
          }
        ],
        tip: "SELECT * tüm sütunları getirir ama performans açısından sadece gerekli sütunları seçmek daha iyidir."
      },
      { name: "SELECT", desc: "FROM olmadan kullanılabilir. Hesaplama yapmak veya fonksiyon çağırmak için idealdir.",
        syntax: "SELECT ifade;",
        examples: [
          { 
            label: "Hesaplama", 
            code: "SELECT 1 + 1;",
            output: {
              headers: ["1 + 1"],
              rows: [["2"]]
            }
          },
          { 
            label: "Fonksiyon çağırma", 
            code: "SELECT NOW();\nSELECT CONCAT('John', ' ', 'Doe') AS name;",
            output: {
              headers: ["name"],
              rows: [["John Doe"]]
            }
          }
        ],
        tip: "AS anahtar kelimesi ile sütunlara takma ad (alias) verebilirsiniz."
      }
    ]
  },
  {
    id: 2, title: "Veri Sıralama", titleEn: "Sorting Data",
    topics: [
      { name: "ORDER BY", desc: "Sonuç kümesini belirtilen sütunlara göre sıralar. Varsayılan ASC (artan).",
        syntax: "SELECT sütunlar\nFROM tablo\nORDER BY sütun1 [ASC|DESC],\n         sütun2 [ASC|DESC];",
        examples: [
          { 
            label: "Artan sıralama (A-Z)", 
            code: "SELECT contactLastName, contactFirstName\nFROM customers\nORDER BY contactLastName;",
            output: {
              headers: ["contactLastName", "contactFirstName"],
              rows: [
                ["Accorti", "Paolo"],
                ["Alonso", "Eduardo"],
                ["Anton", "Carmen"],
                ["Ashworth", "Victoria"]
              ]
            }
          },
          { 
            label: "İfade ile sıralama", 
            code: "SELECT orderNumber, quantityOrdered * priceEach AS subtotal\nFROM orderdetails\nORDER BY subtotal DESC;",
            output: {
              headers: ["orderNumber", "subtotal"],
              rows: [
                ["10403", "11503.14"],
                ["10405", "11170.52"],
                ["10407", "10723.60"]
              ],
              note: "DESC ile büyükten küçüğe sıralanır."
            }
          }
        ],
        tip: "FIELD() fonksiyonu ile özel sıralama düzeni belirleyebilirsiniz: ORDER BY FIELD(status, 'In Process', 'On Hold', 'Shipped')"
      }
    ]
  },
  {
    id: 3, title: "Veri Filtreleme", titleEn: "Filtering Data",
    topics: [
      { name: "WHERE", desc: "Satırları belirli koşullara göre filtreler. Karşılaştırma operatörleri: =, <>, !=, <, >, <=, >=",
        syntax: "SELECT sütunlar\nFROM tablo\nWHERE koşul;",
        examples: [
          { 
            label: "Eşitlik", 
            code: "SELECT lastName, firstName, jobTitle\nFROM employees\nWHERE jobTitle = 'Sales Rep';",
            output: {
              headers: ["lastName", "firstName", "jobTitle"],
              rows: [
                ["Jennings", "Leslie", "Sales Rep"],
                ["Thompson", "Leslie", "Sales Rep"],
                ["Firrelli", "Julie", "Sales Rep"]
              ]
            }
          }
        ]
      },
      { name: "SELECT DISTINCT", desc: "Tekrarlanan satırları kaldırarak yalnızca benzersiz sonuçları döndürür.",
        syntax: "SELECT DISTINCT sütun1, sütun2\nFROM tablo;",
        examples: [
          { 
            label: "Benzersiz değerler", 
            code: "SELECT DISTINCT status\nFROM orders;",
            output: {
              headers: ["status"],
              rows: [
                ["Shipped"],
                ["Resolved"],
                ["Cancelled"],
                ["On Hold"],
                ["Disputed"],
                ["In Process"]
              ]
            }
          }
        ],
        tip: "Birden fazla sütun kullanıldığında, kombinasyonun benzersiz olması yeterlidir."
      },
      { name: "AND Operatörü", desc: "Birden fazla koşulun HEPSİNİN doğru olmasını gerektirir. Kısa devre (short-circuit) yapar.",
        syntax: "koşul1 AND koşul2 AND koşul3 ...",
        examples: [
          { 
            label: "AND kullanımı", 
            code: "SELECT customername, country, state\nFROM customers\nWHERE country = 'USA' AND state = 'CA';",
            output: {
              headers: ["customername", "country", "state"],
              rows: [
                ["Mini Wheels Co.", "USA", "CA"],
                ["Mini Gifts Distributors Ltd.", "USA", "CA"],
                ["Board & Toys Co.", "USA", "CA"]
              ]
            }
          }
        ]
      },
      { name: "OR Operatörü", desc: "Koşullardan EN AZ BİRİNİN doğru olması yeterlidir. AND, OR'dan önce değerlendirilir!",
        syntax: "koşul1 OR koşul2 OR koşul3 ...",
        examples: [
          { 
            label: "Parantez önemi", 
            code: "SELECT customername, country, creditLimit\nFROM customers\nWHERE (country = 'USA' OR country = 'France')\n  AND creditlimit > 100000;",
            output: {
              headers: ["customername", "country", "creditLimit"],
              rows: [
                ["La Rochelle Gifts", "France", "118200.00"],
                ["Mini Gifts Distributors Ltd.", "USA", "210500.00"],
                ["Euro+ Shopping Channel", "France", "227600.00"]
              ],
              note: "Parantezler olmasaydı AND öncelikli olacağı için sonuç tamamen farklı olurdu."
            }
          }
        ],
        tip: "⚠️ AND, OR'dan yüksek önceliğe sahiptir. Parantez kullanarak doğru gruplayın!"
      },
      { name: "IN Operatörü", desc: "Bir değerin belirtilen listedeki değerlerden biriyle eşleşip eşleşmediğini kontrol eder.",
        syntax: "değer IN (değer1, değer2, değer3, ...)",
        examples: [
          { 
            label: "IN kullanımı", 
            code: "SELECT officeCode, city, phone\nFROM offices\nWHERE country IN ('USA', 'France');",
            output: {
              headers: ["officeCode", "city", "phone"],
              rows: [
                ["1", "San Francisco", "+1 650 219 4782"],
                ["2", "Boston", "+1 215 837 0825"],
                ["3", "NYC", "+1 212 555 3000"],
                ["4", "Paris", "+33 14 723 4404"]
              ]
            }
          }
        ]
      },
      { name: "BETWEEN", desc: "Bir değerin belirli bir aralıkta olup olmadığını kontrol eder (sınırlar dahil).",
        syntax: "değer BETWEEN düşük AND yüksek",
        examples: [
          { 
            label: "Sayısal aralık", 
            code: "SELECT productCode, productName, buyPrice\nFROM products\nWHERE buyPrice BETWEEN 90 AND 100;",
            output: {
              headers: ["productCode", "productName", "buyPrice"],
              rows: [
                ["S10_1949", "1952 Alpine Renault 1300", "98.58"],
                ["S10_4698", "2003 Harley-Davidson Eagle Drag Bike", "91.02"],
                ["S12_1099", "1968 Ford Mustang", "95.34"]
              ]
            }
          }
        ]
      },
      { name: "LIKE", desc: "Desen eşleştirme yapar. % = sıfır veya daha fazla karakter, _ = tek karakter.",
        syntax: "ifade LIKE desen",
        examples: [
          { 
            label: "İçeren", 
            code: "SELECT lastName\nFROM employees\nWHERE lastName LIKE '%son%';",
            output: {
              headers: ["lastName"],
              rows: [
                ["Patterson"],
                ["Patterson"],
                ["Thompson"]
              ],
              note: "İçinde 'son' geçen tüm soyisimler."
            }
          }
        ],
        tip: "Özel karakterleri escape etmek için: LIKE '%\\_20%' ESCAPE '\\\\'"
      },
      { name: "LIMIT", desc: "Dönen satır sayısını kısıtlar. Sayfalama (pagination) için idealdir.",
        syntax: "LIMIT [offset,] satır_sayısı;",
        examples: [
          { 
            label: "İlk 5 kayıt", 
            code: "SELECT customerName\nFROM customers\nORDER BY customerName\nLIMIT 5;",
            output: {
              headers: ["customerName"],
              rows: [
                ["Alpha Cognac"],
                ["Amica Models & Co."],
                ["Anna's Decorations, Ltd"],
                ["Atelier graphique"],
                ["Australian Collectables, Ltd"]
              ]
            }
          }
        ],
        tip: "Offset 0'dan başlar. LIMIT 10, 10 → 11. kayıttan itibaren 10 kayıt getirir."
      },
      { name: "IS NULL", desc: "NULL değerleri kontrol eder. NULL ile = operatörü kullanılamaz!",
        syntax: "değer IS NULL\ndeğer IS NOT NULL",
        examples: [
          { 
            label: "NULL kontrolü", 
            code: "SELECT customerName, salesRepEmployeeNumber\nFROM customers\nWHERE salesRepEmployeeNumber IS NULL;",
            output: {
              headers: ["customerName", "salesRepEmployeeNumber"],
              rows: [
                ["Havel & Zbyszek Co", "NULL"],
                ["Porto Imports Co.", "NULL"],
                ["Asian Shopping Network, Co", "NULL"]
              ]
            }
          }
        ],
        tip: "NULL = NULL ifadesi FALSE döner! NULL kontrolü için her zaman IS NULL / IS NOT NULL kullanın."
      }
    ]
  },
  {
    id: 4, title: "Tablo Birleştirme", titleEn: "Joining Tables",
    topics: [
      { name: "Alias (Takma Ad)", desc: "Sütunlara veya tablolara geçici isim verir. Okunabilirliği artırır.",
        syntax: "SELECT sütun AS takma_ad FROM tablo;",
        examples: [
          { 
            label: "Sütun alias", 
            code: "SELECT CONCAT_WS(', ', lastName, firstName) AS 'Tam Ad'\nFROM employees;",
            output: {
              headers: ["Tam Ad"],
              rows: [
                ["Murphy, Diane"],
                ["Patterson, Mary"],
                ["Firrelli, Jeff"]
              ]
            }
          }
        ]
      },
      { name: "INNER JOIN", desc: "Her iki tabloda da eşleşen kayıtları döndürür.",
        syntax: "SELECT sütunlar\nFROM tablo1\nINNER JOIN tablo2\n  ON tablo1.sütun = tablo2.sütun;",
        examples: [
          { 
            label: "İki tablo birleştirme", 
            code: "SELECT productCode, productName, textDescription\nFROM products\nINNER JOIN productlines USING (productLine);",
            output: {
              headers: ["productCode", "productName", "textDescription"],
              rows: [
                ["S10_1678", "1969 Harley Davidson Ultimate Chopper", "Motorcycles are a range of bikes..."],
                ["S10_1949", "1952 Alpine Renault 1300", "Classic Cars are vehicles..."]
              ]
            }
          }
        ],
        tip: "USING (sütun) kısaltması, her iki tabloda aynı isimli sütun olduğunda ON yerine kullanılabilir."
      },
      { name: "LEFT JOIN", desc: "Sol tablodaki TÜM kayıtları getirir. Sağ tabloda eşleşme yoksa NULL döner.",
        syntax: "SELECT sütunlar\nFROM tablo1\nLEFT JOIN tablo2\n  ON tablo1.sütun = tablo2.sütun;",
        examples: [
          { 
            label: "Eşleşmeyenleri bulma", 
            code: "SELECT c.customerName, o.orderNumber\nFROM customers c\nLEFT JOIN orders o USING (customerNumber)\nWHERE o.orderNumber IS NULL;",
            output: {
              headers: ["customerName", "orderNumber"],
              rows: [
                ["Havel & Zbyszek Co", "NULL"],
                ["Porto Imports Co.", "NULL"],
                ["Asian Shopping Network, Co", "NULL"]
              ],
              note: "Hiç sipariş vermemiş olan müşterileri bulur."
            }
          }
        ],
        tip: "WHERE ... IS NULL ile sağ tabloda eşleşmeyen (yetim) kayıtları bulabilirsiniz."
      }
    ]
  },
  {
    id: 5, title: "Veri Gruplama", titleEn: "Grouping Data",
    topics: [
      { name: "GROUP BY", desc: "Satırları gruplara ayırıp özet bilgi üretir.",
        syntax: "SELECT sütun, aggregate_fonksiyon(sütun)\nFROM tablo\nGROUP BY sütun;",
        examples: [
          { 
            label: "Gruplama", 
            code: "SELECT status, COUNT(*) AS toplam\nFROM orders\nGROUP BY status;",
            output: {
              headers: ["status", "toplam"],
              rows: [
                ["Shipped", "303"],
                ["Resolved", "4"],
                ["Cancelled", "6"],
                ["On Hold", "4"],
                ["Disputed", "3"],
                ["In Process", "6"]
              ]
            }
          }
        ]
      },
      { name: "HAVING", desc: "GROUP BY sonrası oluşan gruplara filtre uygular.",
        syntax: "SELECT sütunlar\nFROM tablo\nGROUP BY sütun\nHAVING koşul;",
        examples: [
          { 
            label: "HAVING ile filtreleme", 
            code: "SELECT orderNumber, SUM(quantityOrdered * priceEach) AS toplam\nFROM orderdetails\nGROUP BY orderNumber\nHAVING toplam > 60000;",
            output: {
              headers: ["orderNumber", "toplam"],
              rows: [
                ["10165", "67392.85"],
                ["10287", "61402.00"],
                ["10310", "61234.67"]
              ]
            }
          }
        ],
        tip: "WHERE → satırları filtreler (GROUP BY'dan ÖNCE). HAVING → grupları filtreler (GROUP BY'dan SONRA)."
      }
    ]
  },
  {
    id: 6, title: "Alt Sorgular", titleEn: "Subqueries",
    topics: [
      { name: "Subquery", desc: "Bir sorgunun içine yerleştirilmiş başka bir sorgudur.",
        syntax: "SELECT sütunlar\nFROM tablo\nWHERE sütun operatör (SELECT sütun FROM tablo2);",
        examples: [
          { 
            label: "Cevabı tek satır/sütun olan", 
            code: "SELECT customerNumber, checkNumber, amount\nFROM payments\nWHERE amount = (\n    SELECT MAX(amount) FROM payments\n);",
            output: {
              headers: ["customerNumber", "checkNumber", "amount"],
              rows: [
                ["141", "JE105477", "120166.58"]
              ]
            }
          }
        ]
      },
      { name: "EXISTS", desc: "Alt sorgunun en az bir satır döndürüp döndürmediğini kontrol eder.",
        syntax: "SELECT sütunlar\nFROM tablo\nWHERE EXISTS (alt_sorgu);",
        examples: [
          { 
            label: "EXISTS ile kontrol", 
            code: "SELECT customerName\nFROM customers\nWHERE EXISTS (\n    SELECT 1\n    FROM orders\n    WHERE orders.customerNumber = customers.customerNumber\n);",
            output: {
              headers: ["customerName"],
              rows: [
                ["Atelier graphique"],
                ["Signal Gift Stores"],
                ["Australian Collectors, Co."]
              ],
              note: "Sipariş vermiş olan müşteriler."
            }
          }
        ],
        tip: "EXISTS, IN'den genellikle daha performanslıdır çünkü ilk eşleşmeyi bulunca durur."
      }
    ]
  },
  {
    id: 7, title: "Küme Operatörleri", titleEn: "Set Operators",
    topics: [
      { name: "UNION", desc: "İki veya daha fazla SELECT sonucunu dikey olarak birleştirir.",
        syntax: "SELECT sütunlar FROM tablo1\nUNION [ALL | DISTINCT]\nSELECT sütunlar FROM tablo2;",
        examples: [
          { 
            label: "UNION", 
            code: "SELECT firstName, lastName, 'Çalışan' AS tip FROM employees\nUNION\nSELECT contactFirstName, contactLastName, 'Müşteri' AS tip FROM customers\nLIMIT 5;",
            output: {
              headers: ["firstName", "lastName", "tip"],
              rows: [
                ["Diane", "Murphy", "Çalışan"],
                ["Mary", "Patterson", "Çalışan"],
                ["Jeff", "Firrelli", "Çalışan"],
                ["Carine", "Schmitt", "Müşteri"],
                ["Jean", "King", "Müşteri"]
              ]
            }
          }
        ],
        tip: "Her iki SELECT'in sütun sayısı ve veri tipleri uyumlu olmalıdır."
      }
    ]
  },
  {
    id: 8, title: "Veritabanı Yönetimi", titleEn: "Managing Databases",
    topics: [
      { name: "CREATE DATABASE", desc: "Yeni bir veritabanı oluşturur.",
        syntax: "CREATE DATABASE [IF NOT EXISTS] veritabanı_adı;",
        examples: [
          { 
            label: "Basit oluşturma", 
            code: "CREATE DATABASE IF NOT EXISTS testdb;",
            output: {
              headers: ["Message"],
              rows: [["Query OK, 1 row affected (0.01 sec)"]]
            }
          }
        ]
      }
    ]
  },
  {
    id: 9, title: "Tablolarla Çalışma", titleEn: "Working with Tables",
    topics: [
      { name: "CREATE TABLE", desc: "Yeni bir tablo oluşturur.",
        syntax: "CREATE TABLE [IF NOT EXISTS] tablo_adı (\n    sütun1 veri_tipi [kısıtlamalar],\n    ...\n);",
        examples: [
          { 
            label: "Tablo oluşturma", 
            code: "CREATE TABLE IF NOT EXISTS tasks (\n    task_id INT AUTO_INCREMENT PRIMARY KEY,\n    title VARCHAR(255) NOT NULL,\n    status TINYINT DEFAULT 1\n);",
            output: {
              headers: ["Message"],
              rows: [["Query OK, 0 rows affected (0.02 sec)"]]
            }
          }
        ]
      },
      { name: "ALTER TABLE", desc: "Mevcut buluna bir tablonun yapısını değiştirir.",
        syntax: "ALTER TABLE tablo_adı\n  ADD sütun veri_tipi\n  | DROP COLUMN sütun;",
        examples: [
          { 
            label: "Sütun ekleme", 
            code: "ALTER TABLE tasks\nADD COLUMN completed BOOLEAN DEFAULT FALSE;",
            output: {
              headers: ["Message"],
              rows: [["Query OK, 0 rows affected (0.03 sec)\nRecords: 0  Duplicates: 0  Warnings: 0"]]
            }
          }
        ]
      }
    ]
  },
  {
    id: 10, title: "Kısıtlamalar", titleEn: "Constraints",
    topics: [
      { name: "PRIMARY KEY", desc: "Her satırı benzersiz olarak tanımlar. NULL olamaz.",
        syntax: "sütun INT PRIMARY KEY",
        examples: [
          { 
            label: "Bileşik birincil anahtar", 
            code: "CREATE TABLE order_items (\n    order_id INT,\n    item_id INT,\n    quantity INT,\n    PRIMARY KEY (order_id, item_id)\n);",
            output: {
              headers: ["Message"],
              rows: [["Query OK, 0 rows affected (0.02 sec)"]]
            }
          }
        ]
      },
      { name: "FOREIGN KEY", desc: "Tablolar arası ilişki kurar.",
        syntax: "FOREIGN KEY (sütun)\n  REFERENCES ebeveyn_tablo(sütun)\n  [ON DELETE CASCADE]",
        examples: [
          { 
            label: "Yabancı anahtar", 
            code: "CREATE TABLE orders (\n    order_id INT PRIMARY KEY,\n    customer_id INT,\n    FOREIGN KEY (customer_id)\n      REFERENCES customers(customer_id)\n      ON DELETE CASCADE\n);",
            output: {
              headers: ["Message"],
              rows: [["Query OK, 0 rows affected (0.02 sec)"]]
            }
          }
        ],
        tip: "ON DELETE CASCADE: Ebeveyn silinince bağlı kayıtlar da silinir."
      }
    ]
  },
  {
    id: 11, title: "Veri Tipleri Detay", titleEn: "Data Types",
    topics: [
      { name: "DATE ve DATETIME", desc: "DATE: 'YYYY-MM-DD'. DATETIME: 'YYYY-MM-DD HH:MM:SS'. TIMESTAMP: Zaman damgası.",
        syntax: "DATE        -- '2024-03-29'\nDATETIME    -- '2024-03-29 14:30:00'\nTIMESTAMP   -- Otomatik güncellenir",
        examples: [
          { 
            label: "Zaman fonksiyonları", 
            code: "SELECT NOW() AS simdi, CURDATE() AS bugun;",
            output: {
              headers: ["simdi", "bugun"],
              rows: [
                ["2026-03-29 14:30:00", "2026-03-29"]
              ]
            }
          }
        ],
        tip: "CURDATE() → bugünün tarihi, NOW() → şu anki tarih ve saat."
      }
    ]
  },
  {
    id: 12, title: "Veri Manipülasyonu", titleEn: "Modifying Data",
    topics: [
      { name: "INSERT", desc: "Tabloya yeni satır(lar) ekler.",
        syntax: "INSERT INTO tablo (sütunlar)\nVALUES (değerler);",
        examples: [
          { 
            label: "Çoklu ekleme", 
            code: "INSERT INTO tasks (title, status)\nVALUES\n    ('Proje planla', 1),\n    ('Kod yaz', 2);",
            output: {
              headers: ["Message"],
              rows: [["Query OK, 2 rows affected (0.01 sec)\nRecords: 2  Duplicates: 0  Warnings: 0"]]
            }
          }
        ]
      },
      { name: "UPDATE", desc: "Mevcut kayıtları günceller.",
        syntax: "UPDATE tablo\nSET sütun = değer\nWHERE koşul;",
        examples: [
          { 
            label: "Güncelleme", 
            code: "UPDATE employees\nSET email = 'yeni@email.com'\nWHERE employeeNumber = 1056;",
            output: {
              headers: ["Message"],
              rows: [["Query OK, 1 row affected (0.01 sec)\nRows matched: 1  Changed: 1  Warnings: 0"]]
            }
          }
        ],
        tip: "⚠️ WHERE koşulunu unutmayın! WHERE yazmazsanız TÜM satırları günceller."
      },
      { name: "DELETE", desc: "Tablodan kayıt siler.",
        syntax: "DELETE FROM tablo\nWHERE koşul;",
        examples: [
          { 
            label: "Koşullu silme", 
            code: "DELETE FROM tasks\nWHERE status = 'completed'\n  AND due_date < '2024-01-01';",
            output: {
              headers: ["Message"],
              rows: [["Query OK, 5 rows affected (0.01 sec)"]]
            }
          }
        ],
        tip: "⚠️ DELETE + WHERE olmadan tüm veriler silinir! TRUNCATE daha hızlıdır ama geri alınamaz."
      }
    ]
  },
  {
    id: 13, title: "CTE (Ortak Tablo İfadeleri)", titleEn: "Common Table Expressions",
    topics: [
      { name: "CTE (Common Table Expression)", desc: "Sorgu içinde geçici adlandırılmış sonuç kümesi oluşturur.",
        syntax: "WITH cte_adı AS (\n    SELECT ...\n)\nSELECT * FROM cte_adı;",
        examples: [
          { 
            label: "Basit CTE", 
            code: "WITH usa_customers AS (\n    SELECT customerName, state\n    FROM customers\n    WHERE country = 'USA'\n)\nSELECT customerName\nFROM usa_customers\nWHERE state = 'CA';",
            output: {
              headers: ["customerName"],
              rows: [
                ["Mini Wheels Co."],
                ["Mini Gifts Distributors Ltd."],
                ["Board & Toys Co."]
              ]
            }
          }
        ],
        tip: "CTE, karmaşık sorguları parçalara ayırarak okunabilirliği büyük ölçüde artırır."
      }
    ]
  }
];
