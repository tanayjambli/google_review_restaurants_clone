-- list databases: \l
CREATE TABLE restaurants (
    id bigserial not null primary key,
    name varchar (100) not null,
    location varchar (100) not null,
    price_range int not null check (price_range >=1 and price_range <= 5)
);

insert into restaurants (name, location, price_range) values ('McDonalds', 'New York', 1);

create table reviews (
    id bigserial not null primary key,
    restaurant_id bigint not null references restaurants(id),
    name varchar(50) not null,
    review text not null,
    rating int not null check(rating >= 1 and rating <= 5)
);