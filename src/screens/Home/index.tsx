import React, { useEffect, useRef, useState } from 'react';
import { FlatList } from 'react-native';
import BottomSheet, { useBottomSheet } from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message';

import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'
import { compose } from 'recompose'
import withObservables from '@nozbe/with-observables'

import { Menu, MenuTypeProps } from '../../components/Menu';
import { Skill } from '../../components/Skill';
import { Button } from '../../components/Button';

import { SkillModel } from '../../database/models/skillModel';

import { Container, Title, Input, Form, FormTitle } from './styles';
import Database from '@nozbe/watermelondb/Database';

type Props = {
  database: Database,
  skills: SkillModel[]
}

export function Home({ database, skills }: Props) {

  const [type, setType] = useState<MenuTypeProps>("soft");
  const [name, setName] = useState('');
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
      Toast.show({
        type: 'success',
        text1: 'Skill updated!',
      });
    } else {
      await database.write(async () => {
        await skillsCollection.create(data => {
          data.name = name
          data.type = type
        })
      })
  
      Toast.show({
        type: 'success',
        text1: 'Skill saved!',
      });
    }

    setName('')
    bottomSheetRef.current.collapse()
  }

  const handleRemove = async (item: SkillModel) => {
    await database.write(async () => {
      item.destroyPermanently()
    })

    Toast.show({
      type: 'success',
      text1: 'Skill deleted!',
    });
  }

  const handleEdit = async (item: SkillModel) => {
    setSkill(item)
    setName(item.name)
    bottomSheetRef.current.expand()
  }

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
        data={skills.filter(skill => skill.type === type)}
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

export default compose(
  withDatabase,
  withObservables([], ({ database }) => ({
    skills: database.get('skills').query(),
  })),
)(Home)