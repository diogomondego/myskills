import React, { useEffect, useRef, useState } from 'react';
import { FlatList } from 'react-native';
import BottomSheet, { useBottomSheet } from '@gorhom/bottom-sheet';
import { Q } from '@nozbe/watermelondb'

import { Menu, MenuTypeProps } from '../../components/Menu';
import { Skill } from '../../components/Skill';
import { Button } from '../../components/Button';

import { database } from '../../database'
import { SkillModel } from '../../database/models/skillModel';

import { Container, Title, Input, Form, FormTitle } from './styles';

export function Home() {
  const [type, setType] = useState<MenuTypeProps>("soft");
  const [name, setName] = useState('');
  const [skills, setSkills] = useState<SkillModel[]>([]);
  const [skill, setSkill] = useState<SkillModel>({} as SkillModel);
  const [sheetPosition, setSheetPosition] = useState(0);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleSave = async () => {
    const skillsCollection = database.get<SkillModel>('skills');

    if (skill.id) {
      await database.write(async () => {
        skill.update(data => {
          data.name = name
          data.type = type
        })
      })

      setSkill({} as SkillModel)
      alert('Skill updated!')
    } else {
      await database.write(async () => {
        await skillsCollection.create(data => {
          data.name = name
          data.type = type
        })
      })
  
      alert('Skill saved!')
    }

    fetchSkills()
    setName('')
    bottomSheetRef.current.collapse()
  }

  const handleRemove = async (item: SkillModel) => {
    await database.write(async () => {
      item.destroyPermanently()
    })

    fetchSkills()
    alert('Skill deleted!')
  }

  const handleEdit = async (item: SkillModel) => {
    setSkill(item)
    setName(item.name)
    bottomSheetRef.current.expand()
  }

  const fetchSkills = async () => {
    const skillsCollection = database.get<SkillModel>('skills');

    const skillsResponse = await skillsCollection
      .query( Q.where('type', type) )
      .fetch()
      
    setSkills(skillsResponse)
  }

  useEffect(() => {
    fetchSkills()
  }, [type])

  useEffect(() => {
    if (skill.id && !sheetPosition) {
      setSkill({} as SkillModel)
      setName('')
    }
  }, [sheetPosition])

  return (
    <Container>
      <Title>About me</Title>
      <Menu
        type={type}
        setType={setType}
      />

      <FlatList
        data={skills}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Skill
            data={item}
            onEdit={() => handleEdit(item)}
            onRemove={() => handleRemove(item)}
          />
        )}
      />

      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={['4%', '35%']}
        onChange={setSheetPosition}
      >
        <Form>
          <FormTitle>
            {skill.id ? 'Edit skill' : 'New skill'}
          </FormTitle>

          <Input
            placeholder="New skill..."
            onChangeText={setName}
            value={name}
          />

          <Button
            title="Save"
            onPress={handleSave}
          />
        </Form>
      </BottomSheet>
    </Container>
  );
}