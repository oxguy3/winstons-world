<?xml version="1.0" encoding="UTF-8"?>
<tileset version="1.2" tiledversion="1.2.5" name="default" tilewidth="32" tileheight="32" spacing="2" margin="1" tilecount="8" columns="4">
 <image source="default.png" width="136" height="68"/>
 <tile id="0" type="dirt">
  <properties>
   <property name="collides" type="bool" value="true"/>
   <property name="ice" type="bool" value="false"/>
   <property name="kill" type="bool" value="false"/>
  </properties>
 </tile>
 <tile id="1" type="portal">
  <properties>
   <property name="collides" type="bool" value="false"/>
   <property name="ice" type="bool" value="false"/>
   <property name="kill" type="bool" value="false"/>
  </properties>
 </tile>
 <tile id="2" type="grass">
  <properties>
   <property name="collides" type="bool" value="true"/>
   <property name="ice" type="bool" value="false"/>
   <property name="kill" type="bool" value="false"/>
  </properties>
 </tile>
 <tile id="3" type="ice">
  <properties>
   <property name="collides" type="bool" value="true"/>
   <property name="ice" type="bool" value="true"/>
   <property name="kill" type="bool" value="false"/>
  </properties>
 </tile>
 <tile id="4" type="arrow-up">
  <properties>
   <property name="collides" type="bool" value="true"/>
   <property name="ice" type="bool" value="false"/>
   <property name="kill" type="bool" value="false"/>
  </properties>
 </tile>
 <tile id="5" type="crate">
  <properties>
   <property name="collides" type="bool" value="true"/>
   <property name="ice" type="bool" value="false"/>
   <property name="kill" type="bool" value="false"/>
  </properties>
 </tile>
 <tile id="6" type="spike">
  <properties>
   <property name="collides" type="bool" value="true"/>
   <property name="ice" type="bool" value="false"/>
   <property name="kill" type="bool" value="true"/>
  </properties>
  <objectgroup draworder="index">
   <object id="2" x="0" y="32">
    <polygon points="0,0 32,0 16,-31.875"/>
   </object>
  </objectgroup>
 </tile>
 <tile id="7">
  <properties>
   <property name="collides" type="bool" value="false"/>
   <property name="ice" type="bool" value="false"/>
   <property name="kill" type="bool" value="false"/>
  </properties>
 </tile>
</tileset>
